import React, { useMemo } from 'react';

const CourseProgress = () => {
  const progress = useMemo(() => {
    const start = new Date('2024-09-28').getTime();
    const end = new Date('2028-07-31').getTime();
    const now = Date.now();

    const percentage = ((now - start) / (end - start)) * 100;
    return Math.round(Math.min(Math.max(percentage, 0), 100) * 100) / 100;
  }, []);

  return (
    <div className="flex flex-col justify-center h-full w-full p-2">
      <div className="flex justify-between items-end mb-2">
        <h3 className="text-[10px] font-bold tracking-widest text-gray-500">
          MEng Progress
        </h3>
        <span className="text-xs font-mono font-bold text-green-500">
          {progress}%
        </span>
      </div>

      <div className="w-full h-2 rounded-md border border-green-500/20 bg-black/50">
        <div className="h-full w-full overflow-hidden rounded-md">
          <div
            className="h-full bg-green-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex justify-between mt-2 text-[9px] text-gray-400 font-bold uppercase tracking-tighter opacity-60">
        <span>Start</span>
        <span>Graduation</span>
      </div>
    </div>
  );
};

export default CourseProgress;
