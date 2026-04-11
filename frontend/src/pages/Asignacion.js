import React from 'react';
import { Result, Typography, Button } from 'antd';
import { RocketOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const Asignacion = () => {
  return (
    <Result
      icon={<RocketOutlined style={{ color: '#1677ff' }} />}
      title="Asignación Automática"
      subTitle="Coming Soon, SAYLESS"
      extra={[
        <Button type="primary" key="console" size="large" shape="round">
          Volver al Inicio
        </Button>,
      ]}
    >
    </Result>
  );
};

export default Asignacion;
