import L from 'leaflet';

import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadowUrl from 'leaflet/dist/images/marker-shadow.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';

const DefaultIcon = L.icon({
    iconUrl,
    shadowUrl: iconShadowUrl,
    iconRetinaUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

export { DefaultIcon };