import { MongoClient, ObjectId } from 'mongodb';
import { Pray }  from '@/types';
import {format} from 'date-fns-tz';
import './postcard.css';

interface Submission extends Pray {
  _id: string; // ObjectId를 string으로
}

async function getData() {
  const res = await fetch('http://localhost:3000/api/search', { cache: 'no-store' }); // 서버 컴포넌트에서 직접 호출 시에는 절대경로
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  return res.json();
}


export default async function List(){
    const response: Submission[] = await getData();
    const sortedResponse = response.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()); // 최신순 정렬
    console.log(response);


    return(
        <div style={{'maxWidth': '800px', 'margin':'0 auto', 'paddingLeft':'16px', 'paddingRight':'16px'}}>
          <ul className='PostCardGrid_block'>
        {sortedResponse.map((item) => (
            item.isPublic ? (
              <li key={item._id} className='PostCard_block__FTMsy'>
                <div className='PostCard_content__W3lPm'>
                  <h4 className='PostCard_h4'>{item.content}</h4>
                  <div className='PostCard_subInfo__KqVkC'>
                    <span>{format(new Date(item.submittedAt).toLocaleString(),'yyyy.MM.dd HH:mm')}</span>
                  </div>
                </div>
                <div className='PostCard_footer__9J5Wd'>
                  <span className='PostCard_userInfo__Cu1X5'><span style={{'color':'#868e96'}}>by&nbsp;</span><b>{item.isAnonymous ? "익명" : item.nickname}</b></span>
                </div>
              </li>

            
            // <div key={item._id} className="border p-4 rounded-md shadow">
            //     <h2 className="text-lg font-semibold">{item.isAnonymous? "익명" : item.nickname}</h2>
            //     {/*<p className="text-gray-600">User ID: {item.userId}</p> {/* userId가 필요한 경우 */}
            //     <p>Content: {item.content}</p>
            //     <p>At: {format(new Date(item.submittedAt).toLocaleString(),'yyyy.MM.dd HH:mm')}</p> {/* 날짜 형식 변환 */}
            // </div>
            ) : null
      ))}
      </ul>
        </div>
    );
}