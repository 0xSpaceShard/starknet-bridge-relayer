import * as winston from 'winston';

export const json = (): winston.Logform.Format => {
  return winston.format.combine(winston.format.json());
};

export const simple = (): winston.Logform.Format => {
  return winston.format.combine(winston.format.simple());
};
