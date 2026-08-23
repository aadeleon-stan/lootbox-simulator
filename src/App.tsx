import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HUD from './components/HUD';
import Login from './screens/Login';
import MainMenu from './screens/MainMenu';
import OpenBoxes from './screens/OpenBoxes';
import BuyBoxes from './screens/BuyBoxes';
import BuyGems from './screens/BuyGems';
import Payment from './screens/Payment';
import LootRoll from './screens/LootRoll';
import Compendium from './screens/Compendium';

export default function App() {
  return (
    <BrowserRouter basename="/emptyfull">
      <HUD />
      <div className="pt-[52px]">
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/main-menu" element={<MainMenu />} />
        <Route path="/open-boxes" element={<OpenBoxes />} />
        <Route path="/buy-boxes" element={<BuyBoxes />} />
        <Route path="/buy-gems" element={<BuyGems />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/loot-roll" element={<LootRoll />} />
        <Route path="/compendium" element={<Compendium />} />
      </Routes>
      </div>
    </BrowserRouter>
  );
}
