/**
 * Timer工具
 */
export class TimerManager {

    private static _instance: TimerManager;
    
    private static __id: number = new Date().getTime();

   constructor() {
        this.init();
    }


    // /**
    //  * 获取Timer管理器
    //  */
    public static getInstance(): TimerManager {
        if (!TimerManager._instance) {
            TimerManager._instance = new TimerManager()
        }
        return this._instance;
    }


    /**
    * 初始化
    */
    private init() {
        // cc.director.getScheduler().enableForTarget(this);
        this["_id"] = `Scheduler${TimerManager.__id++}`;
    }


    /**
     * Timer
     * @param handler 回调
     * @param interval 间隔时间
     * @param repeat 重复次数（实际运行repeat + 1次）
     * @param delay 延迟多少时间后开始执行
     */
    public runTimer(handler: Function, interval: number, repeat: number, delay: number, pause: boolean) {
        return this.schedule(handler, interval, repeat, delay, pause);
    }


    /**
     * Timer延迟执行
     * @param handler 回调
     * @param delayTime 延迟时间
     */
    public runDelayTimer(handler: (dt: number) => void, delayTime: number = 0.01) {
        return this.scheduleOnce(handler, delayTime);
    }


    /**
     * Timer循环执行
     * @param handler 回调
     * @param intervlTime 间隔时间
     * @param delay 延迟时间执行
     */
    public runLoopTimer(handler: (dt: number) => void, intervlTime: number = 0.02, delay?: number) {
        return this.schedule(handler, intervlTime ? intervlTime : 0.02, cc.macro.REPEAT_FOREVER, delay ? delay : 0, false);
    }


    /**
     * 移除计时器Timer
     * @param handler 回调
     */
    public removeTimer(handler: Function) {
        this.unschedule(handler);
    }


    /**
     * 移除所有Timer
     */
    public removeAllTimers() {
        cc.director.getScheduler().unscheduleAllForTarget(this)
    }


    /**
     * 暂停所有计时器
     */
    public pause() {
        cc.director.getScheduler().pauseTarget(this)
    }


    /**
     * 运行所有计时器
     */
    public resume() {
        cc.director.getScheduler().resumeTarget(this)
    }


    /**
     * 单次调度
     * @param handler 
     * @param delay 
     */
    private scheduleOnce(handler, delay) {
        this.schedule(handler, 0, 0, delay, false);
        return handler;
    }


    /**
     * Timer开始调度
     * @param handler 回调
     * @param interval 间隔时间
     * @param repeat 重复次数（实际运行repeat + 1次）
     * @param delay 延迟多少时间后开始执行
     * @param pause 是否暂停
     */
    private schedule(handler: Function, interval: number, repeat: number, delay: number, pause: boolean) {
        cc.director.getScheduler().schedule(handler, this, interval, repeat, delay, pause);
        return handler;
    }


    /**
     * 移除调度
     * @param handler 
     */
    private unschedule(handler) {
        if (!handler) return;
        cc.director.getScheduler().unschedule(handler, this);
    }

}