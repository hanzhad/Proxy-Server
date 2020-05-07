import config from './config';
import * as _ from 'lodash';
import server from './server';

const servers = {};

_.map(config.targets, server(servers));
