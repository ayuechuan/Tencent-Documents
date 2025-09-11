import { IReactionOptions, IReactionPublic, makeObservable, observable, reaction } from "mobx"
import { observer } from "mobx-react-lite";
export class ContainerStore {
  config = observable.object({ limit: 50 });
  constructor() {
    makeObservable(this);
  }
}
export const SmartSheet = observer(() => {
  const store = new ContainerStore();
  useEffect(() => {
    return reaction(() => store.config, (arg, pre) => { })
  }, [])
  //  我希望这样使用 useReaction如何修改
  useReaction(() => {

  }, store.config, { delay: 200 })
  return <div></div>
});

export function useReaction<T, FireImmediately extends boolean = false>
  (effect: (arg: T, prev: FireImmediately extends true ? T | undefined : T, r: IReactionPublic) => void,
    expression: T,
    opts?: IReactionOptions<T, FireImmediately>) {
  useEffect(() => reaction(() => expression, effect, opts), []);
}


function useUsers() {

  return useCallback(() => {

  }, [])
}