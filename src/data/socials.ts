export interface SocialNetwork {
  name: string;
  url: string;
  icon: string;
}

export const artisticNetworks: SocialNetwork[] = [
  { name: 'YouTube', url: 'https://youtube.com/@tarquitet', icon: 'youtube.svg' },
  { name: 'VGen', url: 'https://vgen.co/tarquitet', icon: 'vgen.svg' },
  { name: 'Discord', url: 'https://discord.gg/REMWQJRpnH', icon: 'discord.svg' },
  { name: 'Twitter / X', url: 'https://twitter.com/tarquitet', icon: 'x.svg' },
  { name: 'ArtStation', url: 'https://artstation.com/tarquitet', icon: 'artstation.svg' },
  { name: 'DeviantArt', url: 'https://www.deviantart.com/tarquitet2002', icon: 'deviant.svg' },
];
