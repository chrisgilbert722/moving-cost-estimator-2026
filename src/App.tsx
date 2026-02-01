import { useState } from 'react';

interface MovingInput {
    distance: number;
    homeSize: 'studio' | '1br' | '2br' | '3br';
    moveType: 'local' | 'longDistance';
    packingServices: boolean;
    storageNeeded: boolean;
}

const SIZE_MULTIPLIER: Record<string, number> = { studio: 1.0, '1br': 1.4, '2br': 1.9, '3br': 2.6 };
const SIZE_LABELS: Record<string, string> = { studio: 'Studio', '1br': '1 Bedroom', '2br': '2 Bedroom', '3br': '3+ Bedroom' };

const MOVING_TIPS: string[] = [
    'Get at least 3 quotes from licensed movers',
    'Book early during peak season (May–September)',
    'Declutter before moving to reduce costs',
    'Verify insurance coverage and licensing'
];

const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

function App() {
    const [values, setValues] = useState<MovingInput>({ distance: 50, homeSize: '2br', moveType: 'local', packingServices: false, storageNeeded: false });
    const handleChange = (field: keyof MovingInput, value: string | number | boolean) => setValues(prev => ({ ...prev, [field]: value }));

    const sizeMultiplier = SIZE_MULTIPLIER[values.homeSize];

    // Base cost calculation
    let baseCost: number;
    let distanceCost: number;

    if (values.moveType === 'local') {
        // Local: base hourly rate * size factor
        baseCost = 400 * sizeMultiplier;
        distanceCost = Math.round(values.distance * 2);
    } else {
        // Long distance: weight-based estimate + distance
        baseCost = 1200 * sizeMultiplier;
        distanceCost = Math.round(values.distance * 0.75);
    }

    const sizeCost = Math.round(baseCost);
    const packingCost = values.packingServices ? Math.round(300 * sizeMultiplier) : 0;
    const storageCost = values.storageNeeded ? 250 : 0;

    const totalEstimate = sizeCost + distanceCost + packingCost + storageCost;
    const lowEstimate = Math.round(totalEstimate * 0.8);
    const highEstimate = Math.round(totalEstimate * 1.3);

    const serviceAddons = packingCost + storageCost;

    const breakdownData = [
        { label: 'Base Moving Cost', value: fmt(sizeCost), isTotal: false },
        { label: 'Distance Cost', value: fmt(distanceCost), isTotal: false },
        { label: 'Packing Services', value: packingCost > 0 ? fmt(packingCost) : '$0', isTotal: false },
        { label: 'Storage (1 month)', value: storageCost > 0 ? fmt(storageCost) : '$0', isTotal: false },
        { label: 'Estimated Total', value: fmt(totalEstimate), isTotal: true }
    ];

    return (
        <main style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            <header style={{ textAlign: 'center', marginBottom: 'var(--space-2)' }}>
                <h1 style={{ marginBottom: 'var(--space-2)' }}>Moving Cost Estimator (2026)</h1>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.125rem' }}>Estimate local vs long distance moving costs</p>
            </header>

            <div className="card">
                <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                        <div>
                            <label htmlFor="distance">Distance (miles)</label>
                            <input id="distance" type="number" min="1" max="3000" step="10" value={values.distance || ''} onChange={(e) => handleChange('distance', parseInt(e.target.value) || 0)} placeholder="50" />
                        </div>
                        <div>
                            <label htmlFor="moveType">Move Type</label>
                            <select id="moveType" value={values.moveType} onChange={(e) => handleChange('moveType', e.target.value)}>
                                <option value="local">Local (under 100 mi)</option>
                                <option value="longDistance">Long Distance</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="homeSize">Home Size</label>
                        <select id="homeSize" value={values.homeSize} onChange={(e) => handleChange('homeSize', e.target.value)}>
                            <option value="studio">Studio / Small</option>
                            <option value="1br">1 Bedroom</option>
                            <option value="2br">2 Bedroom</option>
                            <option value="3br">3+ Bedroom</option>
                        </select>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3)', backgroundColor: '#F8FAFC', borderRadius: 'var(--radius-md)' }}>
                            <input id="packingServices" type="checkbox" checked={values.packingServices} onChange={(e) => handleChange('packingServices', e.target.checked)} />
                            <label htmlFor="packingServices" style={{ margin: 0, cursor: 'pointer' }}>Packing Services</label>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3)', backgroundColor: '#F8FAFC', borderRadius: 'var(--radius-md)' }}>
                            <input id="storageNeeded" type="checkbox" checked={values.storageNeeded} onChange={(e) => handleChange('storageNeeded', e.target.checked)} />
                            <label htmlFor="storageNeeded" style={{ margin: 0, cursor: 'pointer' }}>Storage Needed</label>
                        </div>
                    </div>
                    <button className="btn-primary" type="button">Estimate Cost</button>
                </div>
            </div>

            <div className="card results-panel">
                <div className="text-center">
                    <h2 className="result-label" style={{ marginBottom: 'var(--space-2)' }}>Estimated Total Moving Cost</h2>
                    <div className="result-hero">{fmt(totalEstimate)}</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: 'var(--space-2)' }}>{SIZE_LABELS[values.homeSize]} • {values.distance} miles</div>
                </div>
                <hr className="result-divider" />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', textAlign: 'center' }}>
                    <div>
                        <div className="result-label">Service Add-ons</div>
                        <div className="result-value">{fmt(serviceAddons)}</div>
                    </div>
                    <div style={{ borderLeft: '1px solid #BAE6FD', paddingLeft: 'var(--space-4)' }}>
                        <div className="result-label">Cost Range</div>
                        <div className="result-value">{fmt(lowEstimate)} – {fmt(highEstimate)}</div>
                    </div>
                </div>
            </div>

            <div className="card" style={{ borderLeft: '4px solid var(--color-primary)' }}>
                <h3 style={{ fontSize: '1.125rem', marginBottom: 'var(--space-4)' }}>Moving Tips</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 'var(--space-3)' }}>
                    {MOVING_TIPS.map((item, i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', fontSize: '0.9375rem', color: 'var(--color-text-secondary)' }}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--color-primary)', flexShrink: 0 }} />{item}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="ad-container"><span>Advertisement</span></div>

            <div className="card" style={{ padding: 0 }}>
                <div style={{ padding: 'var(--space-4) var(--space-6)', borderBottom: '1px solid var(--color-border)' }}>
                    <h3 style={{ fontSize: '1rem' }}>Cost Breakdown</h3>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9375rem' }}>
                    <tbody>
                        {breakdownData.map((row, i) => (
                            <tr key={i} style={{ borderBottom: i === breakdownData.length - 1 ? 'none' : '1px solid var(--color-border)', backgroundColor: row.isTotal ? '#F0F9FF' : (i % 2 ? '#F8FAFC' : 'transparent') }}>
                                <td style={{ padding: 'var(--space-3) var(--space-6)', color: 'var(--color-text-secondary)', fontWeight: row.isTotal ? 600 : 400 }}>{row.label}</td>
                                <td style={{ padding: 'var(--space-3) var(--space-6)', textAlign: 'right', fontWeight: 600, color: row.isTotal ? 'var(--color-primary)' : 'var(--color-text-primary)' }}>{row.value}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div style={{ maxWidth: 600, margin: '0 auto', fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                <p>This calculator provides estimates of moving costs based on general industry averages. Actual costs vary significantly by location, season, specific services, and moving company rates. The figures shown are estimates only and do not constitute a binding quote. Always obtain detailed quotes from licensed movers before booking. Verify licensing and insurance before hiring any moving company.</p>
            </div>

            <footer style={{ textAlign: 'center', padding: 'var(--space-8) var(--space-4)', color: 'var(--color-text-muted)', borderTop: '1px solid var(--color-border)', marginTop: 'var(--space-8)' }}>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 'var(--space-4)', fontSize: '0.875rem' }}>
                    <li>• Estimates only</li><li>• Not a binding quote</li><li>• Free to use</li>
                </ul>
                <nav style={{ marginTop: 'var(--space-4)', display: 'flex', gap: 'var(--space-4)', justifyContent: 'center' }}>
                    <a href="https://scenariocalculators.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: '#94A3B8', fontSize: '0.75rem' }}>Privacy Policy</a>
                    <span style={{ color: '#64748B' }}>|</span>
                    <a href="https://scenariocalculators.com/terms" target="_blank" rel="noopener noreferrer" style={{ color: '#94A3B8', fontSize: '0.75rem' }}>Terms of Service</a>
                </nav>
                <p style={{ marginTop: 'var(--space-4)', fontSize: '0.75rem' }}>&copy; 2026 Moving Cost Estimator</p>
            </footer>

            <div className="ad-container ad-sticky"><span>Advertisement</span></div>
        </main>
    );
}

export default App;
