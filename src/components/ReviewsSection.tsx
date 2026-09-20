import React, { useState } from 'react';
import { Star, CheckCircle, MessageSquare, Plus } from 'lucide-react';
import { Review } from '../types';
import { REVIEWS as initialReviews } from '../data/menuData';

export const ReviewsSection: React.FC = () => {
  const [reviewsList, setReviewsList] = useState<Review[]>(initialReviews);
  const [showAddForm, setShowAddForm] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [dishInput, setDishInput] = useState('Crown Crust Pizza');
  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState('');

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim() || !commentInput.trim()) return;

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      name: nameInput,
      rating: ratingInput,
      comment: commentInput,
      date: 'Just now',
      dishName: dishInput,
      verifiedOrder: true,
    };

    setReviewsList([newRev, ...reviewsList]);
    setNameInput('');
    setCommentInput('');
    setShowAddForm(false);
    alert('Thank you for reviewing Pizza Pro Shergarh!');
  };

  return (
    <section className="py-12 bg-zinc-50 border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-200">
              CUSTOMER LOVE
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight mt-2">
              Reviews from Shergarh Locals
            </h2>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-2xl font-bold text-xs uppercase shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>{showAddForm ? 'CANCEL' : 'WRITE A REVIEW'}</span>
          </button>
        </div>

        {/* Add Review Form */}
        {showAddForm && (
          <form
            onSubmit={handleSubmitReview}
            className="mb-8 p-6 bg-white rounded-3xl border border-zinc-200 shadow-lg space-y-4 max-w-xl mx-auto"
          >
            <h3 className="font-extrabold text-sm text-zinc-900 uppercase">
              Share Your Pizza Pro Experience
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-bold text-zinc-700 block mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tariq Mehmood"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-zinc-700 block mb-1">Dish Ordered</label>
                <input
                  type="text"
                  placeholder="e.g. Fillet Burger"
                  value={dishInput}
                  onChange={(e) => setDishInput(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-zinc-700 text-xs block mb-1">Rating (1 to 5 Stars)</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRatingInput(star)}
                    className={`p-2 rounded-lg border ${
                      ratingInput >= star ? 'bg-amber-100 border-amber-400 text-amber-600' : 'bg-zinc-50 border-zinc-200 text-zinc-400'
                    }`}
                  >
                    <Star className="w-5 h-5 fill-current" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="font-bold text-zinc-700 text-xs block mb-1">Your Feedback *</label>
              <textarea
                rows={3}
                required
                placeholder="How was the taste, delivery speed, and hot packaging?"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-red-600 text-white font-black text-xs uppercase rounded-xl"
            >
              POST REVIEW
            </button>
          </form>
        )}

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviewsList.map((rev) => (
            <div
              key={rev.id}
              className="p-5 bg-white rounded-3xl border border-zinc-200 shadow-xs flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] text-zinc-400 font-bold">{rev.date}</span>
                </div>

                <p className="text-xs text-zinc-700 font-medium leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
                <div>
                  <h4 className="font-black text-xs text-zinc-900">{rev.name}</h4>
                  <span className="text-[10px] text-red-600 font-bold">{rev.dishName}</span>
                </div>
                {rev.verifiedOrder && (
                  <span className="p-1 bg-emerald-50 text-emerald-600 rounded-full" title="Verified Customer">
                    <CheckCircle className="w-4 h-4" />
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
