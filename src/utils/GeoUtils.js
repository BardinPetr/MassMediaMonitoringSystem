const rad2degr = (x) => x * 180 / Math.PI;
const degr2rad = (x) => x * Math.PI / 180;


export const getGeoCenter = (data) => {
    let lat;
    let lng;
    let sumX = 0;
    let sumY = 0;
    let sumZ = 0;

    for (let i = 0; i < data.length; i++) {
        lat = degr2rad(data[i][0]);
        lng = degr2rad(data[i][1]);
        sumX += Math.cos(lat) * Math.cos(lng);
        sumY += Math.cos(lat) * Math.sin(lng);
        sumZ += Math.sin(lat);
    }

    let avgX = sumX / data.length,
        avgY = sumY / data.length,
        avgZ = sumZ / data.length;

    lng = Math.atan2(avgY, avgX);
    let hyp = Math.sqrt(avgX * avgX + avgY * avgY);
    lat = Math.atan2(avgZ, hyp);

    return ([rad2degr(lat), rad2degr(lng)]);
};