import { observer, useLocalObservable } from "mobx-react-lite"
import { CounterStore, SearchStore } from "../index.store"
import { Button } from "tdesign-react"
import { useGlobaData } from "@/providers/globa-data";
import { observable } from "mobx";

export const Searchs = observer(() => {
  const store = useState(() => new CounterStore())[0];
  const search = useLocalObservable(() => new SearchStore());
  // const store1 = useLocalObservable(() => new CounterStore());
  const navigate = useNavigate();
  const globadata = useGlobaData();
  
  // console.log('search--------', search.array);

  // const store = useContext(CounterStoreContext);
  return (
    <div style={{ color: '#FFF' }}>
      <div>{store.loading ? '1' : " '0"}</div>
      {search.items.map((item) => {
        return <div key={item.id}>{item.name}</div>
      })}
      123-{store.dataSource[0]?.name}-{store.searchKey.get()}-{globadata?.value}
      <Button type='button' onClick={() => {
        search.add();
        // store.setLoading(true)
        // setTimeout(() => {
        //   navigate('/canvas')
        // }, 2000);
      }}>添加-{search.array.length}</Button>
    </div>
  )
})