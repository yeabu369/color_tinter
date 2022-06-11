import './App.css';
import { useState } from 'react';
import { SwatchesPicker } from 'react-color';
import { SketchPicker } from 'react-color';
import Beaker from './assets/beaker.jpeg';
import axios from 'axios';

function App() {
  const [color, setColor] = useState({
    rgb: {
      r: 0,
      g: 0,
      b: 0,
      a: 1,
    }
  });
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [cmykValue, setCmykValue] = useState([0, 0, 0, 0]);
  const [cmykVolumes, setCmykVolumes] = useState([0, 0, 0, 0, 0]);
  const [volume, setVolume] = useState(0);

  const handleColorChange = (color, event) => {
    const { r, g, b } = color.rgb;
    setColor(color);
    setCmykValue(rgbToCmyk(r, g, b));
    setCmykVolumes(getVolumeProportion(cmykValue, volume));
  };

  const handleColorOrder = async (event) => {
    const response = await axios.get("https://2ee9-197-156-86-59.eu.ngrok.io");
    console.log(response);
  }

  const handleVolumeChange = (event) => {
    const volume = parseInt(event.target.value);
    setVolume(volume);
    setCmykVolumes(getVolumeProportion(cmykValue, volume));
  }

  // A function that converts from rgb to cmyk
  const rgbToCmyk = (r, g, b) => {
    r /= 255;
    g /= 255;
    b /= 255;
    let k = (1 - Math.max(r, g, b));
    let c = ((1 - r - k) / (1 - k)) * 100;
    let m = ((1 - g - k) / (1 - k)) * 100;
    let y = ((1 - b - k) / (1 - k)) * 100;

    if (isNaN(c) || isNaN(m) || isNaN(y)) return [0, 0, 0, 100];
    return [c.toFixed(2), m.toFixed(2), y.toFixed(2), (k * 100).toFixed(2)];
  }

  const getVolumeProportion = (color, volume) => {
    const [c, m, y, k] = color;
    const c_ml = parseFloat(c) * volume / 400;
    const m_ml = parseFloat(m) * volume / 400;
    const y_ml = parseFloat(y) * volume / 400;
    const k_ml = parseFloat(k) * volume / 400;
    const w_ml = volume - c_ml - m_ml - y_ml - k_ml;
    return [c_ml.toFixed(1), m_ml.toFixed(1), y_ml.toFixed(1), k_ml.toFixed(1), w_ml.toFixed(1)];
  }

  const inverseColor = (color) => {
    return `rgba(${255 - color.rgb.r}, ${255 - color.rgb.g}, ${255 - color.rgb?.b}, ${color.rgb?.a})`;
  }

  return (
    <div className="App flex border">
      <main className="App-header border-2 border-black" style={{ backgroundColor: `${color.hex}` }}>
        {showColorPicker ? <SwatchesPicker
          color={color}
          onChange={handleColorChange}
        /> : <SketchPicker color={color} onChange={handleColorChange} />}

        <button onClick={() => setShowColorPicker(!showColorPicker)} >Switch Picker</button>

        <div style={{ color: inverseColor(color) }}>
          <h5>C M Y K</h5>
          <h2>{cmykValue.join(" ")}</h2>
        </div>

        <div style={{ color: inverseColor(color) }}>
          <label>Volume</label>
          <div className='beaker'>
            <img src={Beaker} alt="Beaker" width="100px" height="100px" />
            <input type="range" min="0" max="1000" step="10" onChange={handleVolumeChange} value={volume} class="volume-slide" />
          </div>
        </div>
        <div style={{ color: inverseColor(color) }}>
          <h3>{volume} ml</h3>
          <h4>{cmykVolumes.join(" ml ")}</h4>
        </div>
        <button onClick={handleColorOrder}>Order Color Mix</button>
      </main>
    </div>
  );
}

export default App;
