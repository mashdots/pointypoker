import React, { useState } from 'react';

const Room = () => {
  const [description, setDescription] = useState('');
  const [pointing, setPointing] = useState('');

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  const handlePointing = (points: string) => {
    setPointing(points);
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <section>
        <input type="text" value={description} onChange={handleDescriptionChange} placeholder="Describe what is being pointed" />
      </section>
      <section>
        <button onClick={() => handlePointing('1')}>1</button>
        <button onClick={() => handlePointing('2')}>2</button>
        <button onClick={() => handlePointing('3')}>3</button>
        <button onClick={() => handlePointing('4')}>4</button>
        <button onClick={() => handlePointing('5')}>5</button>
        <button onClick={() => handlePointing('6')}>6</button>
        <button onClick={() => handlePointing('7')}>7</button>
        <button onClick={() => handlePointing('8')}>8</button>
        <button onClick={() => handlePointing('9')}>9</button>
        <button onClick={() => handlePointing('10')}>10</button>
        <button onClick={() => handlePointing('11')}>11</button>
        <button onClick={() => handlePointing('12')}>12</button>
        <button onClick={() => handlePointing('13')}>13</button>
        <button onClick={() => handlePointing('?')}>?</button>
      </section>
    </div>
  );
};

export default Room;
