/**
 * Dimension Config
 */

function createDimensions() {
    const map = new Map();

    map.set('acousticness', (() => {
        const map = new Map();
        map.set('name', 'acousticness');
        map.set('title', 'Acousticness');
        map.set('type', 'numerical');
        map.set('description', 'A confidence measure from 0.0 to 1.0 of whether the track is acoustic. 1.0 represents high confidence the track is acoustic.');
        return map;
    })());

    map.set('album_popularity', (() => {
        const map = new Map();
        map.set('name', 'album_popularity');
        map.set('title', 'Album Popularity');
        map.set('type', 'numerical');
        map.set('description', 'The popularity of the album. The value will be between 0 and 100, with 100 being the most popular.');
        return map;
    })());

    map.set('artist_popularity', (() => {
        const map = new Map();
        map.set('name', 'artist_popularity');
        map.set('title', 'Artist Popularity');
        map.set('type', 'numerical');
        map.set('description', 'The popularity of the artist. The value will be between 0 and 100, with 100 being the most popular. The artist\'s popularity is calculated from the popularity of all the artist\'s tracks.');
        return map;
    })());

    map.set('danceability', (() => {
        const map = new Map();
        map.set('name', 'danceability');
        map.set('title', 'Danceability');
        map.set('type', 'numerical');
        map.set('description', 'Danceability describes how suitable a track is for dancing based on a combination of musical elements including tempo, rhythm stability, beat strength, and overall regularity. A value of 0.0 is least danceable and 1.0 is most danceable.');
        return map;
    })());

    map.set('duration_ms', (() => {
        const map = new Map();
        map.set('name', 'duration_ms');
        map.set('title', 'Duration');
        map.set('type', 'numerical');
        map.set('description', 'The duration of the track in milliseconds.');
        map.set('formatter', (dv) => {
            const date = new Date(dv);
                return [date.getMinutes(), date.getSeconds()].map(
                    v => String(v).padStart(2, '0')
                ).join(':')
        });
        return map;
    })());

    map.set('energy', (() => {
        const map = new Map();
        map.set('name', 'energy');
        map.set('title', 'Energy');
        map.set('type', 'numerical');
        map.set('description', 'Energy is a measure from 0.0 to 1.0 and represents a perceptual measure of intensity and activity. Typically, energetic tracks feel fast, loud, and noisy. For example, death metal has high energy, while a Bach prelude scores low on the scale. Perceptual features contributing to this attribute include dynamic range, perceived loudness, timbre, onset rate, and general entropy.');
        return map;
    })());

    map.set('instrumentalness', (() => {
        const map = new Map();
        map.set('name', 'instrumentalness');
        map.set('title', 'Instrumentalness');
        map.set('type', 'numerical');
        map.set('description', 'Predicts whether a track contains no vocals. "Ooh" and "aah" sounds are treated as instrumental in this context. Rap or spoken word tracks are clearly "vocal". The closer the instrumentalness value is to 1.0, the greater likelihood the track contains no vocal content. Values above 0.5 are intended to represent instrumental tracks, but confidence is higher as the value approaches 1.0.');
        return map;
    })());

    map.set('key', (() => {
        const map = new Map();
        map.set('name', 'key');
        map.set('title', 'Key');
        map.set('type', 'categorical');
        map.set('description', 'The key the track is in. Integers map to pitches using standard Pitch Class notation. E.g. 0 = C, 1 = C♯/D♭, 2 = D, and so on. If no key was detected, the value is -1.');
        const valueMap = new Map();
        valueMap.set('0', 'C');
        valueMap.set('1', 'C♯');
        valueMap.set('2', 'D');
        valueMap.set('3', 'D♯');
        valueMap.set('4', 'E');
        valueMap.set('5', 'F');
        valueMap.set('6', 'F♯');
        valueMap.set('7', 'G');
        valueMap.set('8', 'G♯');
        valueMap.set('9', 'A');
        valueMap.set('10', 'A♯');
        valueMap.set('11', 'B');
        map.set('valueMap', valueMap);

        map.set('formatter', (dv) => valueMap.get(String(dv)));
        return map;
    })());

    map.set('liveness', (() => {
        const map = new Map();
        map.set('name', 'liveness');
        map.set('title', 'Liveness');
        map.set('type', 'numerical');
        map.set('description', 'Detects the presence of an audience in the recording. Higher liveness values represent an increased probability that the track was performed live. A value above 0.8 provides strong likelihood that the track is live.');
        return map;
    })());

    map.set('loudness', (() => {
        const map = new Map();
        map.set('name', 'loudness');
        map.set('title', 'Loudness');
        map.set('type', 'numerical');
        map.set('description', 'The overall loudness of a track in decibels (dB). Loudness values are averaged across the entire track and are useful for comparing relative loudness of tracks. Loudness is the quality of a sound that is the primary psychological correlate of physical strength (amplitude). Values typically range between -60 and 0 db.');
        return map;
    })());

    map.set('mode', (() => {
        const map = new Map();
        map.set('name', 'mode');
        map.set('title', 'Mode');
        map.set('type', 'categorical');
        map.set('description', 'Mode indicates the modality (major or minor) of a track, the type of scale from which its melodic content is derived. Major is represented by 1 and minor is 0.');
        const valueMap = new Map();
        valueMap.set('0', 'Minor');
        valueMap.set('1', 'Major');
        map.set('valueMap', valueMap);

        map.set('formatter', (dv) => valueMap.get(String(dv)));
        return map;
    })());

    map.set('release_date', (() => {
        const map = new Map();
        map.set('name', 'release_date');
        map.set('title', 'Release Date');
        map.set('type', 'numerical');
        map.set('description', 'The date the album was first released.');
        return map;
    })());

    map.set('speechiness', (() => {
        const map = new Map();
        map.set('name', 'speechiness');
        map.set('title', 'Speechiness');
        map.set('type', 'numerical');
        map.set('description', 'Speechiness detects the presence of spoken words in a track. The more exclusively speech-like the recording (e.g. talk show, audio book, poetry), the closer to 1.0 the attribute value. Values above 0.66 describe tracks that are probably made entirely of spoken words. Values between 0.33 and 0.66 describe tracks that may contain both music and speech, either in sections or layered, including such cases as rap music. Values below 0.33 most likely represent music and other non-speech-like tracks.');
        return map;
    })());

    map.set('tempo', (() => {
        const map = new Map();
        map.set('name', 'tempo');
        map.set('title', 'Tempo');
        map.set('type', 'numerical');
        map.set('description', 'The overall estimated tempo of a track in beats per minute (BPM). In musical terminology, tempo is the speed or pace of a given piece and derives directly from the average beat duration.');
        return map;
    })());

    map.set('time_signature', (() => {
        const map = new Map();
        map.set('name', 'time_signature');
        map.set('title', 'Time Signature');
        map.set('type', 'categorical');
        map.set('description', 'An estimated time signature. The time signature (meter) is a notational convention to specify how many beats are in each bar (or measure). The time signature ranges from 3 to 7 indicating time signatures of "3/4", to "7/4".');
        const valueMap = new Map();
        valueMap.set('3', '3/4');
        valueMap.set('4', '4/4');
        valueMap.set('5', '5/4');
        valueMap.set('6', '6/4');
        valueMap.set('7', '7/4');
        map.set('valueMap', valueMap);

        map.set('formatter', (dv) => valueMap.get(String(dv)) ? valueMap.get(String(dv)) : '???');
        return map;
    })());

    map.set('total_tracks', (() => {
        const map = new Map();
        map.set('name', 'total_tracks');
        map.set('title', 'Total Tracks');
        map.set('type', 'numerical');
        map.set('description', 'The total number of tracks in this track\'s album.');
        return map;
    })());

    map.set('valence', (() => {
        const map = new Map();
        map.set('name', 'valence');
        map.set('title', 'Valence');
        map.set('type', 'numerical');
        map.set('description', 'A measure from 0.0 to 1.0 describing the musical positiveness conveyed by a track. Tracks with high valence sound more positive (e.g. happy, cheerful, euphoric), while tracks with low valence sound more negative (e.g. sad, depressed, angry).');
        return map;
    })());

    return map;
}

module.exports.dimensionsConfig = createDimensions();
