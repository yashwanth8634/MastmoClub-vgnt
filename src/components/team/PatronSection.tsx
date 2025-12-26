export default function PatronsSection() {
  const patrons = [
    "Dr. P Aparna Reddy",
    "Dr. P Nagaraju",
    "Dr. Pavan Kumar",
    "Mr. Venugopal Reddy",
    "Mr. Maneender",
    "Mr. H Avinash",
    "Mr. Sathish",
    "Mr. Lakshmi Narayana",
    "Mr. Veman Reddy",
    "Mrs. Sree Lakshmi"
  ];

  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-10 tracking-tight">
          Our <span className="text-[#00f0ff]">Patrons</span>
        </h2>

        {/* Simple Flex Wrap Layout */}
        <div className="flex flex-wrap justify-center gap-4">
          {patrons.map((name, index) => (
            <div 
              key={index} 
              className="bg-black border border-white/10 px-6 py-3 rounded-full text-gray-200 font-medium hover:border-[#00f0ff]/50 hover:text-white transition-colors"
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}