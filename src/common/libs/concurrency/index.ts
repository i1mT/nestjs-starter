import Queue from 'yocto-queue';

export default function pLimit(concurrency) {
  validateConcurrency(concurrency);

  const queue = [];
  let activeCount = 0;

  const resumeNext = () => {
    if (activeCount < concurrency && queue.length > 0) {
      const fn = queue.shift();
      fn();
      // Since `pendingCount` has been decreased by one, increase `activeCount` by one.
      activeCount++;
    }
  };

  const next = () => {
    activeCount--;

    resumeNext();
  };

  const run = async (function_, resolve, arguments_) => {
    const result = (async () => function_(...arguments_))();

    resolve(result);

    try {
      await result;
    } catch {}

    next();
  };

  const enqueue = (function_, resolve, arguments_) => {
    // Queue `internalResolve` instead of the `run` function
    // to preserve asynchronous context.
    new Promise((internalResolve) => {
      queue.push(internalResolve);
    }).then(run.bind(undefined, function_, resolve, arguments_));

    (async () => {
      // This function needs to wait until the next microtask before comparing
      // `activeCount` to `concurrency`, because `activeCount` is updated asynchronously
      // after the `internalResolve` function is dequeued and called. The comparison in the if-statement
      // needs to happen asynchronously as well to get an up-to-date value for `activeCount`.
      await Promise.resolve();

      if (activeCount < concurrency) {
        resumeNext();
      }
    })();
  };

  const generator = (function_, ...arguments_) =>
    new Promise((resolve) => {
      enqueue(function_, resolve, arguments_);
    });

  Object.defineProperties(generator, {
    activeCount: {
      get: () => activeCount,
    },
    pendingCount: {
      get: () => queue.length,
    },
    clearQueue: {
      value() {
        while (queue.length) {
          queue.pop();
        }
      },
    },
    concurrency: {
      get: () => concurrency,

      set(newConcurrency) {
        validateConcurrency(newConcurrency);
        concurrency = newConcurrency;

        queueMicrotask(() => {
          // eslint-disable-next-line no-unmodified-loop-condition
          while (activeCount < concurrency && queue.length > 0) {
            resumeNext();
          }
        });
      },
    },
  });

  return generator;
}

function validateConcurrency(concurrency) {
  if (
    !(
      (Number.isInteger(concurrency) ||
        concurrency === Number.POSITIVE_INFINITY) &&
      concurrency > 0
    )
  ) {
    throw new TypeError('Expected `concurrency` to be a number from 1 and up');
  }
}
