import { logger } from "react-native-logs";

const config = {
  levels: {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  },
  severity: 'debug',
  transport: (props) => {
    console.log(`${props.level}: ${props.msg}`, ...props.args);
  },
  transportOptions: {
    color: "ansi", // or "web"
    hideDate: false,
    hideLevel: false,
  },
};

const log = logger.createLogger(config);

export default log;