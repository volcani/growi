import { IApiRateLimitConfig } from '../interfaces/api-rate-limit-config';

const getTargetFromKey = (key: string) => {
  return key.replace(/^API_RATE_LIMIT_/, '').replace(/_ENDPOINT$/, '');
};

const generateApiRateLimitConfigFromEndpoint = (envVar: NodeJS.ProcessEnv, endpointKeys: string[]): IApiRateLimitConfig => {
  const apiRateLimitConfig: IApiRateLimitConfig = {};
  endpointKeys.forEach((key) => {

    const endpoint = envVar[key];

    if (endpoint == null || Object.keys(apiRateLimitConfig).includes(endpoint)) {
      return;
    }

    const target = getTargetFromKey(key);
    const method = envVar[`API_RATE_LIMIT_${target}_METHODS`] ?? 'ALL';
    const consumePoints = Number(envVar[`API_RATE_LIMIT_${target}_CONSUME_POINTS`]);

    if (endpoint == null || consumePoints == null) {
      return;
    }

    const config = {
      method,
      consumePoints,
    };

    apiRateLimitConfig[endpoint] = config;
  });

  return apiRateLimitConfig;
};

// this method is called only one server starts
export const generateApiRateLimitConfig = (): IApiRateLimitConfig => {
  const envVar = process.env;

  const apiRateEndpointKeys = Object.keys(envVar).filter((key) => {
    const endpointRegExp = /^API_RATE_LIMIT_\w+_ENDPOINT/;
    return endpointRegExp.test(key);
  });

  // sort priority
  apiRateEndpointKeys.sort().reverse();

  // get config
  const apiRateLimitConfig = generateApiRateLimitConfigFromEndpoint(envVar, apiRateEndpointKeys);

  // default setting e.g. healthchack
  apiRateLimitConfig['/_api/v3/healthcheck'] = {
    method: 'GET',
    consumePoints: 0,
  };

  return apiRateLimitConfig;
};
