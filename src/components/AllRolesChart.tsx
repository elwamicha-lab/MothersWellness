import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { CareerMatchResult } from '../utils/scoring';
import { X, BarChart3 } from 'lucide-react';

interface AllRolesChartProps {
  isOpen: boolean;
  onClose: () => void;
  matches: CareerMatchResult[];
}

export const AllRolesChart: React.FC<AllRolesChartProps> = ({
  isOpen,
  onClose,
  matches,
}) => {
  if (!isOpen) return null;

  // Prepare data for Recharts (all 15 roles sorted by match score)
  const chartData = [...matches].reverse().map((m) => ({
    name: m.role.role,
    overallScore: m.overallScore,
    skillsScore: m.skillsScore,
    interestsScore: m.interestsScore,
    fitScore: m.fitScore,
    interestArea: m.role.interestArea,
  }));

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="all-roles-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs"
    >
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-[#EFEAE2] overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#F4DDD2] flex items-center justify-between bg-[#FFF6F2]">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#B8533E]" />
            <div>
              <h2 id="all-roles-title" className="text-base font-bold text-[#2D2320] leading-tight">
                All 15 Career Matches
              </h2>
              <p className="text-xs text-[#7A6E69] mt-0.5">
                Overall match score / 100 based on your skills, interests and work fit
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chart area */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 min-h-[420px]">
          <div className="h-[520px] w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
              >
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  tick={{ fontSize: 11, fill: '#7A6E69' }}
                  tickFormatter={(val) => `${val}%`}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={150}
                  tick={{ fontSize: 11, fill: '#2D2320' }}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(value: any, _name: any, item: any) => [
                    `${value}/100 (Skills: ${item.payload.skillsScore}, Interests: ${item.payload.interestsScore}, Fit: ${item.payload.fitScore})`,
                    'Overall Match',
                  ]}
                  contentStyle={{
                    backgroundColor: '#2D2320',
                    color: '#FFF8F5',
                    borderRadius: '8px',
                    fontSize: '12px',
                    border: 'none',
                  }}
                  itemStyle={{ color: '#FCD8CC' }}
                />
                <Bar dataKey="overallScore" radius={[0, 6, 6, 0]}>
                  {chartData.map((entry, index) => {
                    // Top 3 in warm terracotta, others in warm peach
                    const isTopThree = index >= chartData.length - 3;
                    return (
                      <Cell
                        key={`cell-${index}`}
                        fill={isTopThree ? '#B8533E' : '#E8A796'}
                      />
                    );
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-between text-[11px] text-[#7A6E69] pt-3 border-t border-[#EFEAE2]">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-[#B8533E]" />
                <span>Top 3 Matches</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-[#E8A796]" />
                <span>Other library roles</span>
              </span>
            </div>
            <span>Formula: 0.45×Skills + 0.30×Interests + 0.25×Fit</span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#EFEAE2] bg-[#FAF7F2] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#B8533E] hover:bg-[#A34532] text-white font-medium rounded-lg text-xs cursor-pointer shadow-xs transition-colors"
          >
            Close view
          </button>
        </div>
      </div>
    </div>
  );
};
