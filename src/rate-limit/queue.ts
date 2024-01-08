export class Queue {
  private _store: any[];
  constructor() {
    this._store = [];
  }

  public enqueue(data: any) {
    this._store.push(data);
  }

  public dequeue() {
    return this._store.shift();
  }

  public size() {
    return this._store.length;
  }
}
