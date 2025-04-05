// src/components/Stack.js
export default function Stack({ direction = 'horizontal', gap = '10px', wrap = false, children }) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: direction === 'horizontal' ? 'row' : 'column',
          gap,
          flexWrap: wrap ? 'wrap' : 'nowrap'
        }}
      >
        {children}
      </div>
    );
  }
  