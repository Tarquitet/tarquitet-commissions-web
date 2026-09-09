import AboutArtist from '../components/AboutArtist';
import GuidelinesSection from '../components/GuidelinesSection';
import TOSSection from '../components/TOSSection';
import ContactSection from '../components/ContactSection';
import CommissionGallery from '../components/CommissionConfigurator';

export interface SectionData {
  id: 'about' | 'commissions' | 'scope' | 'tos' | 'contact';
  component: React.ComponentType<any>;
}

export const sections: SectionData[] = [
  { id: 'about', component: AboutArtist },
  { id: 'commissions', component: CommissionGallery },
  { id: 'scope', component: GuidelinesSection },
  { id: 'tos', component: TOSSection },
  { id: 'contact', component: ContactSection },
];
