import React from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { PuzzlePieceIcon, ExclamationTriangleIcon, UsersIcon, SparklesIcon } from '../../constants';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const HealthTile: React.FC<{ icon: React.ReactNode; title: string; subtitle: string; cta: string; }> = ({ icon, title, subtitle, cta }) => (
    <Card className="text-center">
        <div className="text-crimson-blue bg-crimson-blue/10 p-3 rounded-lg w-12 h-12 mx-auto mb-3 flex items-center justify-center">
            {icon}
        </div>
        <h3 className="text-2xl font-bold text-text-primary">{title}</h3>
        <p className="text-text-secondary text-sm mb-4">{subtitle}</p>
        <Button>{cta}</Button>
    </Card>
);

const pieData = [
    { name: 'Invalid', value: 400 },
    { name: 'Valid', value: 300 },
    { name: 'Non-Indiv.', value: 300 },
];
const COLORS = ['#ef4737', '#2f7fc3', '#06c3f6'];

const ComplianceDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
        <div>
            <h2 className="text-2xl font-bold text-text-primary">Data Health Center</h2>
            <p className="text-text-secondary">AI-powered tools to clean, enrich, and maintain your database.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <HealthTile icon={<PuzzlePieceIcon />} title="6,083" subtitle="possible duplicates" cta="Review" />
            <HealthTile icon={<UsersIcon className="w-6 h-6" />} title="2,942" subtitle="missing party data" cta="Predict & Fill" />
            <HealthTile icon={<ExclamationTriangleIcon />} title="183" subtitle="potential excessive contributions flagged" cta="View" />
            <HealthTile icon={<SparklesIcon className="w-6 h-6" />} title="182" subtitle="'Gogle' -> 'Google' normalizations" cta="Fix All" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card title="Fill the Gaps" className="lg:col-span-2">
                <ul className="divide-y divide-base-300">
                    <li className="flex justify-between items-center py-3">
                        <div>
                            <p className="font-semibold">Missing Occupation/Employer</p>
                            <p className="text-sm text-text-secondary">2,150 donors</p>
                        </div>
                        <Button variant="secondary" size="sm">Populate Now?</Button>
                    </li>
                    <li className="flex justify-between items-center py-3">
                        <div>
                            <p className="font-semibold">Missing Phone Numbers</p>
                            <p className="text-sm text-text-secondary">3,890 donors</p>
                        </div>
                        <Button variant="secondary" size="sm">Append from voter file?</Button>
                    </li>
                    <li className="flex justify-between items-center py-3">
                        <div>
                            <p className="font-semibold">Missing Email</p>
                            <p className="text-sm text-text-secondary">1,220 donors</p>
                        </div>
                        <Button variant="secondary" size="sm">Append Now?</Button>
                    </li>
                     <li className="flex justify-between items-center py-3">
                        <div>
                            <p className="font-semibold">Missing Registration Status</p>
                            <p className="text-sm text-text-secondary">6,000 donors</p>
                        </div>
                        <Button variant="secondary" size="sm">Predict Status?</Button>
                    </li>
                     <li className="flex justify-between items-center py-3">
                        <div>
                            <p className="font-semibold">Missing Income Estimates</p>
                            <p className="text-sm text-text-secondary">5,320 donors</p>
                        </div>
                        <Button variant="secondary" size="sm">Estimate Now?</Button>
                    </li>
                </ul>
            </Card>

            <div className="space-y-6">
                <Card title="Itemized Best Efforts">
                    <div style={{ width: '100%', height: 200 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    nameKey="name"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value: number, name: string) => [`${value} Records`, name]} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                     <div className="flex justify-center mt-4 text-xs text-text-secondary gap-4">
                        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#ef4737]"></span>Invalid</div>
                        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#2f7fc3]"></span>Valid</div>
                        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#06c3f6]"></span>Non-Indiv.</div>
                    </div>
                </Card>
                <Card title="Needs Attention Alerts">
                    <ul className="space-y-3">
                        <li className="flex gap-3 items-start p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-yellow-800">Donor listed as PAC but tagged individual — reclassify?</p>
                        </li>
                        <li className="flex gap-3 items-start p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-yellow-800">Employer ‘Gogle’ not recognized — normalize to ‘Google’?</p>
                        </li>
                    </ul>
                </Card>
                <Card title="Quick Fix">
                    <p className="text-sm text-text-secondary mb-3">Standardize all ‘Virginia’ entries to ‘VA’?</p>
                    <Button className="w-full">Clean It Up for Me</Button>
                </Card>
            </div>
        </div>
    </div>
  );
};

export default ComplianceDashboard;