import clone from '@/lib/clone';
import dayjs from 'dayjs';

function createdAtList(list:any,type:string){
  const newList = clone(list)
    .filter((r: { type: string; }) => r.type === type)
    .sort((a: { createAt: string | number | Date | dayjs.Dayjs | null | undefined; }, b: { createAt: string | number | Date | dayjs.Dayjs | null | undefined; }) => dayjs(b.createAt).valueOf()
      - dayjs(a.createAt).valueOf());
  if (newList.length === 0) {return [];}
  type Result = { title: string, total?:number, items: RecordItem[] }[]
  const result: Result = [{
    title: dayjs(newList[0].createAt).format('YYYY-MM-DD'),
    items: [newList[0]]
  }];
  for (let i = 1; i < newList.length; i++) {
    const current = newList[i];
    const last = result[result.length - 1];
    if (dayjs(last.title).isSame(dayjs(current.createAt), 'day')) {
      last.items.push(current);
    } else {
      result.push({
        title: dayjs(current.createAt).format('YYYY-MM-DD'),
        items: [current]
      });
    }
  }
  result.map(group =>{
    group.total = group.items.reduce((sum,item)=> sum +item.amount,0)
  })
  return result;
}

export default createdAtList