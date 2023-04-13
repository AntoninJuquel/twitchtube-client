import axios from 'axios';
import { GenericTwitchResponse, TwitchClip } from 'twitch-api-helix';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

export async function setBaseURL(endpoint: string, port: number) {
  const prev = api.defaults.baseURL;
  api.defaults.baseURL = `http://${endpoint}:${port}`;
  try {
    await api.get('/');
  } catch (e) {
    api.defaults.baseURL = prev;
    throw e;
  }
}

export async function postTwitchConfig(config: any) {
  const response = await api.post('/twitch/config', {
    config,
  });
  return response.data;
}

export async function getTwitchClips(params: any) {
  const response = await api.get<GenericTwitchResponse<TwitchClip>>('/twitch/clips', { params });
  return response;
}

export async function getVideoConfig() {
  const response = await api.get('/video/config');
  return response.data;
}

export async function postVideoConfig(config: any) {
  const response = await api.post('/video/config', config);
  return response.data;
}

export async function postVideoStart(clips: any) {
  const response = await api.post('/video/start', {
    clips,
  });
  return response.data;
}

export async function getVideoDownload() {
  const response = await api
    .get('/video/download', {
      responseType: 'blob',
    })
    .then((res) => {
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');

      link.href = url;
      link.setAttribute('download', 'video.mp4');
      document.body.appendChild(link);
      link.click();
      link.remove();

      return res;
    });
  return response;
}

export async function postVideoOpen(path?: string) {
  const response = await api.post('/video/open', { path });
  return response.data;
}
