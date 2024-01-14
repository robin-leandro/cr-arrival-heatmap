import geojson from './Distritos_de_Costa_Rica.json' with {type: 'json'};
import fs from 'fs'

// add postal code as an id, plotly needs that specific field name to work
geojson.features = geojson.features.map(feature => (
    //_${feature.properties.NOM_DIST.toLowerCase().replaceAll(' ', '-')}
    {...feature, id: `${feature.properties.COD_PROV}${feature.properties.COD_CANT.padStart(2, '0')}${feature.properties.COD_DIST.padStart(2, '0')}`}
    ))


// some features have multiple entries, each describing a Polygon
// we need to convert them to a single MultiPolygon object

const multiPolygonFeatures = geojson.features.reduce(
    (acc, feature) => {
        if (!feature.geometry?.coordinates) 
            return acc
        if (!acc[feature.id]) {
            console.log(`newly adding ${feature.id}`)
            // first time, just put it in the dang obj
            return {...acc, [feature.id]: feature}
        }
        if (acc[feature.id].geometry.type == 'Polygon') {
            // second time, we need to convert to MultiPolygon
            console.log(`converting  ${feature.id} to multipolygon`)
            return {
                ...acc, 
                [feature.id]: {
                    ...acc[feature.id], 
                    geometry: {
                        type: 'MultiPolygon',
                        coordinates: [acc[feature.id].geometry.coordinates, feature.geometry.coordinates]
                   }
                }   
            }
        }
        // third or later time, MultiPolygon should already exist so just add to it
        console.log(`adding a polygon to ${feature.id}`)
        return {
            ...acc,
            [feature.id]: {
                ...acc[feature.id],
                geometry: {
                    type: 'MultiPolygon',
                    coordinates: [...acc[feature.id].geometry.coordinates, feature.geometry.coordinates]
                }
            }
        }
    },
    {}
)

geojson.features = Object.values(multiPolygonFeatures)

fs.writeFileSync('updated_geojson.json', JSON.stringify(geojson))
let codes = geojson.features.map(f => f.id).sort()
let duplicate_codes = codes.filter(((code, i) => codes.indexOf(code) !== i))

console.log(duplicate_codes.reduce((acc, code) => {
    return {...acc, [code]: acc[code] > 1 ? acc[code]+1 : 2}
}, {}))


