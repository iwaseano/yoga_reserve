import React, { useState, useEffect } from 'react';
import * as api from '../api';
import { Service } from '../types';

interface ServiceListProps {
  onSelectService: (service: Service) => void;
}

const ServiceList: React.FC<ServiceListProps> = ({ onSelectService }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const data = await api.getServices();
      setServices(data);
    } catch (error) {
      console.error('サービス取得エラー:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">読み込み中...</div>;
  }

  return (
    <div className="service-list">
      <h2>🧘 レッスン一覧</h2>
      <div className="service-grid">
        {services.map((service) => (
          <div key={service.id} className="service-card">
            <h3>{service.name}</h3>
            <p className="service-description">{service.description}</p>
            <div className="service-duration">⏱ {service.duration}分</div>
            <button
              className="btn-secondary"
              onClick={() => onSelectService(service)}
            >
              予約する
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceList;
