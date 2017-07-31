
import { Observable } from "rxjs/Observable";
import { lens } from "../../operator/lens";

Observable.prototype.lens = lens;

declare module "rxjs/Observable" {
  interface Observable<T> {
    lens: typeof lens;
  }
}
