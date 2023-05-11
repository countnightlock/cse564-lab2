import spotipy
from spotipy.oauth2 import SpotifyClientCredentials

import pandas as pd
from datetime import datetime
import json
import random

auth_manager = SpotifyClientCredentials(client_id="2ff4ff705f074eb4bc1ff5296a34ae93", client_secret="59bfc45fd3634e92bcdf69b06731f5d6")

lz_uri = 'https://open.spotify.com/playlist/6rn21ViY7WVZdPYiauYMTQ?si=b6e607723e104061'
# lz_uri = 'https://open.spotify.com/playlist/1wakCONbrTENKlkZSDZx6o?si=8d7406914da44602'

spotify = spotipy.Spotify(client_credentials_manager=auth_manager)

def get_playlist_items(playlist_url):
    result_items = []
    offset = 0
    while True:
        response = spotify.playlist_items(playlist_url, offset=offset, fields='items(track(id,name,popularity,album(id),artists))')

        if len(response['items']) == 0:
            break

        offset = offset + len(response['items'])

        result_items.extend([{
            'track_id': item['track']['id'],
            'track_name': item['track']['name'],
            'track_popularity': item['track']['popularity'],
            'album_id': item['track']['album']['id'],
            'artist_id': item['track']['artists'][0]['id'],
            # randomly sampling genre and country data
            'genre': random.choices(
                ['Pop', 'Rock', 'Indie', 'Hip-Hop', 'International'],
                [20, 40, 60, 40, 60],
                k=1)[0],
            'country': random.choices(
                ['USA', 'United Kingdom', 'India', 'South Korea'],
                [60, 30, 60, 10],
                k=1)[0],
        } for item in response['items']])

    return pd.DataFrame(data=result_items)


def get_artist_info(artist_ids):
    limit = 50
    result_items = []
    for start in range(0, len(artist_ids), limit):
        response = spotify.artists(artist_ids[start : start + limit])
        result_items.extend([{
            'artist_id': item['id'],
            'artist_name': item['name'],
            'artist_popularity': item['popularity']
        } for item in response['artists']])

    return pd.DataFrame(data=result_items)


def get_album_info(album_ids):
    limit = 20
    result_items = []
    for start in range(0, len(album_ids), limit):
        response = spotify.albums(album_ids[start : start + limit])
        result_items.extend([{
            'album_id': item['id'],
            'album_name': item['name'],
            'album_popularity': item['popularity'],
            'release_date': int(item['release_date'][:4]),
        } for item in response['albums']])

    return pd.DataFrame(data=result_items)


def get_audio_features(track_ids):
    limit = 100
    result_items = []
    for start in range(0, len(track_ids), limit):
        response = spotify.audio_features(track_ids[start : start + limit])
        result_items.extend([{
            'track_id': item['id'],
            'acousticness': item['acousticness'],
            'danceability': item['danceability'],
            'energy': item['energy'],
            'instrumentalness': item['instrumentalness'],
            'liveness': item['liveness'],
            'speechiness': item['speechiness'],
            'valence': item['valence'],
        } for item in response if item is not None])

    return pd.DataFrame(data=result_items)


def get_track_details(track_ids):
    response = spotify.tracks(track_ids)
    result_items = [{
        'track_id': item['id'],
        'track_name': item['name'],
        'album_art_url': item['album']['images'][-1]['url'],
        'artist_name': item['artists'][0]['name'],
        'mp3_preview_url': item['preview_url'],
    } for item in response['tracks']]

    return pd.DataFrame(data=result_items)


def get_recommendations(seed_track_ids):
    response = spotify.recommendations(seed_tracks=seed_track_ids, limit=5)
    result_items = [{
        'track_id': item['id'],
        'track_name': item['name'],
        'album_art_url': item['album']['images'][-1]['url'],
        'artist_name': item['artists'][0]['name'],
        'mp3_preview_url': item['preview_url'],
    } for item in response['tracks']]

    return pd.DataFrame(data=result_items)


def main():
    result_lod = get_playlist_items(lz_uri)

    tracks_df = pd.DataFrame(data=result_lod)
    print(tracks_df)

    artists_df = get_artist_info(tracks_df['artist_id'].unique().tolist())
    print(artists_df)

    merged_df = pd.merge(
        tracks_df,
        artists_df,
        how='inner',
        on='artist_id'
    )

    albums_df = get_album_info(tracks_df['album_id'].unique().tolist())
    print(albums_df)

    merged_df = pd.merge(
        merged_df,
        albums_df,
        how='inner',
        on='album_id'
    )

    features_df = get_audio_features(tracks_df['track_id'].unique().tolist())
    print(features_df)

    merged_df = pd.merge(
        merged_df,
        features_df,
        how='inner',
        on='track_id'
    )

    merged_df.dropna(subset=['acousticness']).reset_index(drop=True)

    # print(merged_df.to_json(orient='records'))
    merged_df.to_csv('analysis1.txt', sep='\t', index=False)

    # print(json.dumps(get_recommendations(['1mea3bSkSGXuIRvnydlB5b', '7LVHVU3tWfcxj5aiPFEW4Q']).to_dict(orient='records')))


if __name__ == '__main__':
    main()
