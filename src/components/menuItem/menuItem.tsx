
import { FC, ReactNode } from 'react';
import 'tdesign-react/esm/dropdown/style/index'
import 'rc-dropdown/assets/index.css';

export interface IMenuItem {
  key: string;
  label: ReactNode;
  onClick: (key: string) => void
}

interface Props extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'> {
  items: Array<IMenuItem>;
  onClick: (key: string) => void;
}

export const MenuItem: FC<Props> = ({ items, onClick, ...props }) => {
  return (
    <div
      {...props}
      onClick={(event) => {
        let element = event.target as HTMLElement;
        while(true){
          if(element.hasAttribute('data-menukey')){
            const datakey = element.getAttribute('data-menukey') || '';
            const item = items.find((item)=>item.key === datakey);
            item?.onClick?.(datakey);
            onClick?.(datakey);
            break;
          }
          if(element === element.parentElement){
            break;
          }
          element = element.parentElement as HTMLElement;
        }

      }}
      className='Td-popup__content Td-dropdown'>
      <div className='Td-dropdown__menu Td-dropdown__menu--right'>
        {items.map((item) => (
          <div key={item.key} data-menukey={item.key}>
            <li className='Td-dropdown__item Td-dropdown__item--theme-default'>
              <span className='Td-dropdown__item-text'>{item.label}</span>
            </li>
          </div>
        ))}
      </div>
    </div>
  )
}