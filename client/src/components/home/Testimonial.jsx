import React from "react";

export const Testimonial = () => {
  return (
    <section id="testimonials" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-wider uppercase">
            <i className="fa-solid fa-heart"></i> Wall of Love
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Don't just take our words for it
          </h2>
          <p className="text-gray-400 text-base sm:text-lg">
            See how candidates secured dream offers at top tech, finance, and
            creative companies using TALVIX.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Testimonial 1 */}
          <div className="glass-card p-6 rounded-2xl flex flex-col justify-between border border-white/5 hover:border-emerald-500/30">
            <div className="space-y-4">
              <div className="flex text-amber-400 text-xs">
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                "TALVIX completely transformed my stagnant resume. Within 2
                weeks of applying with the AI-optimized format, I landed
                interviews at Microsoft and Stripe!"
              </p>
            </div>
            <div className="flex items-center gap-3 pt-6 border-t border-white/5 mt-6">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                alt="Evelyn Chen"
                className="w-10 h-10 rounded-full object-cover border border-emerald-500/40"
              />
              <div>
                <div className="text-sm font-bold text-white flex items-center gap-1">
                  Evelyn Chen{" "}
                  <i className="fa-solid fa-circle-check text-emerald-400 text-xs"></i>
                </div>
                <div className="text-xs text-gray-400">
                  Senior Product Designer at Meta
                </div>
              </div>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="glass-card p-6 rounded-2xl flex flex-col justify-between border border-white/5 hover:border-emerald-500/30">
            <div className="space-y-4">
              <div className="flex text-amber-400 text-xs">
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                "The ATS live score checker is a game changer. I used to send
                hundreds of applications into the void—now 4 out of 5 lead to
                initial recruiter phone screens."
              </p>
            </div>
            <div className="flex items-center gap-3 pt-6 border-t border-white/5 mt-6">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
                alt="Avery Johnson"
                className="w-10 h-10 rounded-full object-cover border border-emerald-500/40"
              />
              <div>
                <div className="text-sm font-bold text-white flex items-center gap-1">
                  Avery Johnson{" "}
                  <i className="fa-solid fa-circle-check text-emerald-400 text-xs"></i>
                </div>
                <div className="text-xs text-gray-400">
                  Staff Backend Engineer at Uber
                </div>
              </div>
            </div>
          </div>

          {/* Testimonial 3 */}
          <div className="glass-card p-6 rounded-2xl flex flex-col justify-between border border-white/5 hover:border-emerald-500/30">
            <div className="space-y-4">
              <div className="flex text-amber-400 text-xs">
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                "Super clean UI and incredibly fast. The bullet point generator
                helped me articulate metrics I couldn't summarize on my own.
                Worth every penny."
              </p>
            </div>
            <div className="flex items-center gap-3 pt-6 border-t border-white/5 mt-6">
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80"
                alt="Marcus Lee"
                className="w-10 h-10 rounded-full object-cover border border-emerald-500/40"
              />
              <div>
                <div className="text-sm font-bold text-white flex items-center gap-1">
                  Marcus Lee{" "}
                  <i className="fa-solid fa-circle-check text-emerald-400 text-xs"></i>
                </div>
                <div className="text-xs text-gray-400">
                  Head of Growth at Techstars
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
