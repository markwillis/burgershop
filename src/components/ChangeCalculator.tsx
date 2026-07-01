import { useState, useMemo } from "react";
import Confetti from "./Confetti";

function getPaymentAmount(total: number): number {
  const bills = [5, 10, 20, 50];
  for (const bill of bills) {
    if (bill >= total) return bill;
  }
  return Math.ceil(total / 50) * 50;
}

export default function ChangeCalculator({
  total,
  onComplete,
  onCancel,
}: {
  total: number;
  onComplete: (amountPaid: number, changeDue: number) => void;
  onCancel: () => void;
}) {
  const [input, setInput] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [correct, setCorrect] = useState(false);

  const amountPaid = useMemo(() => getPaymentAmount(total), [total]);
  const correctChange = useMemo(
    () => Math.round((amountPaid - total) * 100) / 100,
    [amountPaid, total],
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const answer = parseFloat(input);

    if (Math.abs(answer - correctChange) < 0.01) {
      setCorrect(true);
      setShowHint(false);
      setTimeout(() => onComplete(amountPaid, correctChange), 2500);
    } else {
      setShowHint(true);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40 p-4">
      <Confetti active={correct} />
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center">
        {correct ? (
          <div className="py-8">
            <span className="text-6xl block mb-4">🎉</span>
            <h2 className="text-3xl font-bold text-green-600 mb-2">
              Correct!
            </h2>
            <p className="text-xl text-gray-600">
              ${correctChange.toFixed(2)} change - sending to kitchen!
            </p>
          </div>
        ) : (
          <>
            <span className="text-5xl block mb-3">💰</span>
            <h2 className="text-2xl font-bold mb-4">
              Take payment first!
            </h2>

            <div className="bg-amber-50 rounded-2xl p-4 mb-4 space-y-2">
              <p className="text-lg">
                Order total:{" "}
                <span className="font-bold text-2xl">
                  ${total.toFixed(2)}
                </span>
              </p>
              <p className="text-lg">
                Customer pays with:{" "}
                <span className="font-bold text-2xl text-green-600">
                  ${amountPaid.toFixed(2)}
                </span>
              </p>
            </div>

            <p className="text-xl font-bold mb-4">
              How much change do they get?
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl font-bold">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    setShowHint(false);
                  }}
                  placeholder="0.00"
                  className="text-center text-3xl font-bold w-40 border-2 border-amber-300 rounded-xl p-3 focus:border-amber-500 focus:outline-none"
                  autoFocus
                />
              </div>

              <div className="flex gap-3 justify-center">
                <button
                  type="button"
                  onClick={onCancel}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-8 rounded-xl text-lg transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!input}
                  className="bg-amber-400 hover:bg-amber-500 disabled:opacity-40 text-black font-bold py-3 px-10 rounded-xl text-xl transition-all hover:scale-105 active:scale-95"
                >
                  Check!
                </button>
              </div>
            </form>

            {showHint && (
              <div className="mt-4 bg-red-50 text-red-600 rounded-xl p-3">
                <p className="font-bold">Not quite! Try again.</p>
                <p className="text-sm mt-1">
                  Hint: ${amountPaid.toFixed(2)} − ${total.toFixed(2)} = ?
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
