import { EventEmitter } from 'events';

const EventBus = new EventEmitter();
EventBus.setMaxListeners(0); // 不限制 Listener 总数

export { EventBus };
