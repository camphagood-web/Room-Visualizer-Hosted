import { ParallaxHero } from '../components/ParallaxHero';

export const Home = () => {
    return (
        <div className="min-h-screen bg-background">
            <ParallaxHero />

            <section className="py-20 px-4 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="font-heading text-4xl font-bold text-text-heading mb-4">Why Choose Floor Visualizer?</h2>
                    <p className="font-body text-lg text-text-body max-w-2xl mx-auto">
                        Experience the future of home renovation. See exactly how our premium flooring collections look in your space before you buy.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { title: "Upload Your Room", desc: "Take a photo of your space and upload it instantly." },
                        { title: "Choose Your Floor", desc: "Browse our extensive collection of premium hardwoods and vinyls." },
                        { title: "Instant Transformation", desc: "Watch as AI seamlessly replaces your floor in seconds." }
                    ].map((item, i) => (
                        <div key={i} className="bg-surface p-8 rounded-card shadow-card text-center hover:shadow-floating transition-shadow duration-300">
                            <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-secondary font-bold text-2xl">
                                {i + 1}
                            </div>
                            <h3 className="font-heading text-xl font-bold mb-3">{item.title}</h3>
                            <p className="text-text-body">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};
