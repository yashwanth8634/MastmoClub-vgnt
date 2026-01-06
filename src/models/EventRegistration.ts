import mongoose, { Schema, models, model, Document } from "mongoose";

// Interface for the team member sub-document
export interface ITeamMember {
    name: string;
    rollNo: string;
    section: string;
    branch: string;
}

const TeamMemberSchema = new Schema<ITeamMember>({
    name: { type: String, required: true, trim: true },
    rollNo: { type: String, required: true, trim: true, uppercase: true },
    section: { type: String, required: true, trim: true, uppercase: true },
    branch: { type: String, required: true, trim: true }
}, { _id: false });


export interface IEventRegistration extends Document {
    eventId: mongoose.Types.ObjectId;
    fullName: string;
    rollNo: string;
    branch: string;
    section: string;
    year: string;
    teamName?: string;
    teamMembers?: ITeamMember[];
}

const EventRegistrationSchema = new Schema<IEventRegistration>(
  {
    eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    
    // User Details of the person registering
    fullName: { type: String, required: true, trim: true },
    rollNo: { type: String, required: true, trim: true, uppercase: true },
    branch: { type: String, required: true, trim: true },
    section: { type: String, required: true, trim: true, uppercase: true },
    year: { type: String, required: true, trim: true },
    
    // Team Details
    teamName: { type: String, trim: true },
    teamMembers: {
        type: [TeamMemberSchema],
        // Custom validator to ensure all team members are from the same branch
        validate: [
            function(this: IEventRegistration, members: ITeamMember[]): boolean {
                if (!members || members.length === 0) return true;
                const mainRegistrantBranch = this.branch;
                return members.every(member => member.branch === mainRegistrantBranch);
            },
            "All team members must be from the same branch as the main registrant."
        ]
    },
  },
  { timestamps: true }
);

// Index to ensure a user (rollNo) can only register once per event
EventRegistrationSchema.index({ eventId: 1, rollNo: 1 }, { unique: true });

// Index to ensure team names are unique per event. Sparse allows multiple docs without a teamName.
EventRegistrationSchema.index({ eventId: 1, teamName: 1 }, { unique: true, sparse: true });


// Pre-save hook to ensure a student is not on multiple teams for the same event
EventRegistrationSchema.pre("save", async function (this: any) {
    // Only run this logic for new documents
    if (!this.isNew) {
        return;
    }

    // Consolidate all roll numbers: the main registrant plus all team members.
    const allRollNos = [this.rollNo];
    if (this.teamMembers && this.teamMembers.length > 0) {
        allRollNos.push(...this.teamMembers.map((m: any) => m.rollNo));
    }

    // 1. Check for duplicate roll numbers within the submission itself.
    // This catches both duplicate team members and the main registrant being listed as a team member.
    const uniqueRollNos = new Set(allRollNos);
    if (uniqueRollNos.size !== allRollNos.length) {
        const seen = new Set();
        const duplicate = allRollNos.find((roll: any) => seen.size === seen.add(roll).size);
        throw new Error(`Duplicate roll number found in submission: ${duplicate}. Each person can only be listed once.`);
    }

    // For non-team registrations, the unique index on (eventId, rollNo) is sufficient.
    // This hook will provide a better error message than the default DB error.
    
    // 2. Check if any of these members are already registered for this event in any capacity.
    const EventRegModel = models.EventRegistration || model("EventRegistration", EventRegistrationSchema);
    const existingRegistration = await EventRegModel.findOne({
        eventId: this.eventId,
        $or: [
            { rollNo: { $in: allRollNos } },
            { "teamMembers.rollNo": { $in: allRollNos } }
        ]
    }).lean(); // Use .lean() for a performance boost on read-only queries

    if (existingRegistration) {
        // Find which roll number caused the conflict to provide a specific error message.
        const conflictingRollNo: string | undefined = allRollNos.find((rollNo: string): boolean => 
            rollNo === existingRegistration.rollNo || 
            existingRegistration.teamMembers?.some((member: ITeamMember): boolean => member.rollNo === rollNo)
        );
        
        throw new Error(`A student with roll number '${conflictingRollNo || 'a team member'}' is already registered for this event.`);
    }
});


const EventRegistration = models.EventRegistration || model("EventRegistration", EventRegistrationSchema);

export default EventRegistration;