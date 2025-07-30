import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

const DATA_DIR = path.join(process.cwd(), 'data');
const FILE_PATH = path.join(DATA_DIR, 'legislators-current.yaml');
const META_PATH = path.join(DATA_DIR, 'legislators-meta.json');

const CACHE_DURATION = 1000 * 60 * 60 * 24 * 30;

export async function updateLegislatorsFile() {}
