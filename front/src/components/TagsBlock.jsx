import React from 'react';
import { SideBlock } from './SideBlock';
import Skeleton from '@mui/material/Skeleton';

export const TagsBlock = ({ items = [], isLoading = true }) => {
  return (
    <SideBlock title="Тэги">
      <div style={{ display: 'flex', flexWrap: 'wrap', paddingLeft: '20px', paddingTop: '20px', paddingBottom: '20px' }}>
        {(isLoading ? [...Array(5)] : items).map((name, i) => (
          <span
            key={i}
            style={{
              marginRight: '10px',
              marginBottom: '10px',
              backgroundColor: '#f0f0f0',
              padding: '5px 10px',
              borderRadius: '20px',
            }}
          >
            {isLoading ? <Skeleton width={100} /> : `#${name}`} {/* Исправлен JSX */}
          </span>
        ))}
      </div>
    </SideBlock>
  );
};
