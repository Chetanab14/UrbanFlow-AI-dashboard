import React, { useState, useEffect } from 'react';
import { Siren, ArrowRight, Zap, CheckCircle2, RotateCw } from 'lucide-react';

export default function TrafficIntersection({
  selectedJunction,
  initialData,
  onOpenLiveCameras
}) {
  const [data, setData] = useState(initialData);
  const [countdown, setCountdown] = useState(initialData.countdownSeconds || 18);
  const [actionNotice, setActionNotice] = useState(null);

  // Auto-cycle simulation: North -> East -> South -> West
  const cycleOrder = ['north', 'east', 'south', 'west'];

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Advance to next lane
          setData((current) => {
            const currentIdx = cycleOrder.indexOf(current.activeGreenLane);
            const nextIdx = (currentIdx + 1) % cycleOrder.length;
            const newGreen = cycleOrder[nextIdx];
            const futureNext = cycleOrder[(nextIdx + 1) % cycleOrder.length];

            const updatedLanes = { ...current.lanes };
            Object.keys(updatedLanes).forEach((k) => {
              updatedLanes[k] = {
                ...updatedLanes[k],
                isGreen: k === newGreen
              };
            });

            return {
              ...current,
              activeGreenLane: newGreen,
              nextGreenLane: futureNext,
              lanes: updatedLanes
            };
          });
          return 20;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const showNotice = (msg) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 2500);
  };

  // Interactive handler: Officer clicks any lane to make it GREEN immediately
  const handleSelectGreenLane = (laneId) => {
    const currentIdx = cycleOrder.indexOf(laneId);
    const nextLane = cycleOrder[(currentIdx + 1) % cycleOrder.length];

    const updatedLanes = { ...data.lanes };
    Object.keys(updatedLanes).forEach((k) => {
      updatedLanes[k] = {
        ...updatedLanes[k],
        isGreen: k === laneId
      };
    });

    setData({
      ...data,
      activeGreenLane: laneId,
      nextGreenLane: nextLane,
      lanes: updatedLanes
    });
    setCountdown(20);
    showNotice(`Switched Green Signal to ${data.lanes[laneId].name}!`);
  };

  // Interactive handler: Force Emergency Green on the Priority Vehicle Lane
  const handleTriggerPriority = () => {
    const priorityLaneId = data.priorityVehicleLane;
    handleSelectGreenLane(priorityLaneId);
    showNotice(`EMERGENCY: Priority Green Wave granted to ${data.lanes[priorityLaneId].name}!`);
  };

  // Interactive handler: Toggle Priority to another lane
  const handleSetPriorityLane = (laneId) => {
    setData((prev) => ({
      ...prev,
      priorityVehicleLane: laneId
    }));
    showNotice(`Priority vehicle flag moved to ${data.lanes[laneId].name}.`);
  };

  const activeLane = data.lanes[data.activeGreenLane];
  const nextLane = data.lanes[data.nextGreenLane];
  const priorityLane = data.lanes[data.priorityVehicleLane];

  return (
    <div className="dashboard-card" style={{ padding: '16px' }}>
      {/* Box Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid var(--color-border)' }}>
        <div>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-navy)' }}>
            Intersection Traffic Control Box
          </h2>
          <span style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>
            {data.junctionName} • Live Signal Status
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span className="badge badge-online">Adaptive AI Active</span>
        </div>
      </div>

      {actionNotice && (
        <div style={{
          backgroundColor: '#DCFCE7',
          border: '1px solid #86EFAC',
          color: '#166534',
          padding: '6px 10px',
          borderRadius: 'var(--radius-sm)',
          fontSize: 11,
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          marginBottom: 10
        }}>
          <CheckCircle2 size={13} />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Required 4 Items Box */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

        {/* 1. WHICH LANE IS GREEN */}
        <div style={{
          backgroundColor: '#F0FDF4',
          border: '1px solid #BBF7D0',
          borderRadius: 'var(--radius-md)',
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 14,
              height: 14,
              borderRadius: '50%',
              backgroundColor: '#16A34A',
              boxShadow: '0 0 10px #16A34A',
              animation: 'pulse-dot 1.2s infinite'
            }} />
            <div>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#166534', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Active Green Lane
              </span>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#14532D' }}>
                {activeLane.name} ({activeLane.road})
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: 11, color: '#166534', fontWeight: 600 }}>Countdown</span>
            <div className="text-mono" style={{ fontSize: 16, fontWeight: 800, color: '#14532D' }}>
              {countdown}s
            </div>
          </div>
        </div>

        {/* 2. NUMBER OF VEHICLE (All 4 Lanes - Interactive Selection) */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: '10px 14px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-navy)', textTransform: 'uppercase' }}>
              Number of Vehicles per Lane
            </span>
            <span style={{ fontSize: 10, color: 'var(--color-text-secondary)' }}>
              Click any lane to switch Green
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
            {Object.values(data.lanes).map((lane) => {
              const isGreen = lane.isGreen;
              const isPriority = lane.id === data.priorityVehicleLane;

              return (
                <div
                  key={lane.id}
                  onClick={() => handleSelectGreenLane(lane.id)}
                  style={{
                    backgroundColor: isGreen ? '#F0FDF4' : '#F8FAFC',
                    border: isGreen ? '1.5px solid #16A34A' : isPriority ? '1.5px solid #DC2626' : '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '8px 10px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  title="Click to grant Green signal to this lane"
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-navy)' }}>
                      {lane.name.split(' ')[0]}
                    </span>
                    {isGreen && (
                      <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#16A34A' }} />
                    )}
                    {isPriority && !isGreen && (
                      <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#DC2626', animation: 'pulse-dot 1s infinite' }} />
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 4 }}>
                    <span style={{ fontSize: 16, fontWeight: 800, color: isGreen ? '#16A34A' : isPriority ? '#DC2626' : 'var(--color-navy)' }}>
                      {lane.vehicles}
                    </span>
                    <span style={{ fontSize: 10, color: 'var(--color-text-secondary)' }}>vehicles</span>
                  </div>

                  <div style={{ fontSize: 9, color: 'var(--color-text-muted)', marginTop: 2 }}>
                    Speed: {lane.speed}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. PRIORITY VEHICLE LANE */}
        <div style={{
          backgroundColor: '#FEF2F2',
          border: '1px solid #FECACA',
          borderRadius: 'var(--radius-md)',
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 8
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 28,
              height: 28,
              borderRadius: 'var(--radius-sm)',
              backgroundColor: '#FEE2E2',
              color: '#DC2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Siren size={16} />
            </div>
            <div>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#991B1B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Priority Vehicle Lane
              </span>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#991B1B' }}>
                {priorityLane.name} ({priorityLane.priorityReason || 'Ambulance 108 Approaching'})
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {activeLane.id === priorityLane.id ? (
              <span className="badge badge-online">Priority Granted</span>
            ) : (
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={handleTriggerPriority}
                title="Force emergency green wave for ambulance"
              >
                <Zap size={12} />
                <span>Force Green on Priority</span>
              </button>
            )}
          </div>
        </div>

        {/* 4. NEXT GREEN LANE */}
        <div style={{
          backgroundColor: '#F8FAFC',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 14,
              height: 14,
              borderRadius: '50%',
              backgroundColor: '#F59E0B'
            }} />
            <div>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#B45309', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Next Green Lane
              </span>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-navy)' }}>
                {nextLane.name} ({nextLane.road})
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>
              Queue: <strong>{nextLane.vehicles} vehicles</strong>
            </span>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => handleSelectGreenLane(nextLane.id)}
              title="Skip countdown and switch to this lane now"
            >
              <RotateCw size={12} />
              <span>Switch Next Now</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
