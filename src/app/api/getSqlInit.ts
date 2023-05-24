// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import client from '../../lib/client'

type ResponseDataType = {
  StatusCode: number,
  error?: string,
  message: string,
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseDataType>
) {
  if (req.method == 'GET') {
    let sql: string = ''
    for (let i = 0; i <= 32; i++) {
      const data = await client.user.findMany({
        where: { id: i }
      })
      if (data.length === 0) continue
      sql += `INSERT INTO user(id, email, name, password, point) VALUES (${data[0].id}, '${data[0].email}', '${data[0].name}', '${data[0].password}', ${data[0].point});\n`
    }
    console.log(sql)
  }
  res.json({
    StatusCode: 200,
    message: 'good',
  })
}

/*
use dimi6;
INSERT INTO user(id, email, name, password, point) VALUES (1, 'benjamin.kang070406@dimigo.hs.kr', '강태준', '27dee860950265977d4bff21695f389c6fc4e834dd5f5cc76e6a3dcecce4e120', 0);
INSERT INTO user(id, email, name, password, point) VALUES (2, 'kilgoyang@dimigo.hs.kr', '길준혁', '27dee860950265977d4bff21695f389c6fc4e834dd5f5cc76e6a3dcecce4e120', 0); 
INSERT INTO user(id, email, name, password, point) VALUES (3, 'gangssi830@dimigo.hs.kr', '김나경', '27dee860950265977d4bff21695f389c6fc4e834dd5f5cc76e6a3dcecce4e120', 0);
INSERT INTO user(id, email, name, password, point) VALUES (4, 'dimiminxeo72@dimigo.hs.kr', '김민서', '27dee860950265977d4bff21695f389c6fc4e834dd5f5cc76e6a3dcecce4e120', 0);
INSERT INTO user(id, email, name, password, point) VALUES (5, 'sueun7308@dimigo.hs.kr', '김수은', '27dee860950265977d4bff21695f389c6fc4e834dd5f5cc76e6a3dcecce4e120', 0); 
INSERT INTO user(id, email, name, password, point) VALUES (6, 'hyjun0407@dimigo.hs.kr', '김승찬', '27dee860950265977d4bff21695f389c6fc4e834dd5f5cc76e6a3dcecce4e120', 0); 
INSERT INTO user(id, email, name, password, point) VALUES (7, 'jiheon2955@dimigo.hs.kr', '김지헌', '27dee860950265977d4bff21695f389c6fc4e834dd5f5cc76e6a3dcecce4e120', 0);
INSERT INTO user(id, email, name, password, point) VALUES (8, 'hayward_kim@dimigo.hs.kr', '김형석', '27dee860950265977d4bff21695f389c6fc4e834dd5f5cc76e6a3dcecce4e120', 0);
INSERT INTO user(id, email, name, password, point) VALUES (10, 'exon@dimigo.hs.kr', '박시혁', '27dee860950265977d4bff21695f389c6fc4e834dd5f5cc76e6a3dcecce4e120', 0);     
INSERT INTO user(id, email, name, password, point) VALUES (11, 'wane@dimigo.hs.kr', '박종휘', '27dee860950265977d4bff21695f389c6fc4e834dd5f5cc76e6a3dcecce4e120', 0);     
INSERT INTO user(id, email, name, password, point) VALUES (12, 'jjuhyun@dimigo.hs.kr', '박주현', '27dee860950265977d4bff21695f389c6fc4e834dd5f5cc76e6a3dcecce4e120', 0);  
INSERT INTO user(id, email, name, password, point) VALUES (14, 'jjangi0503@dimigo.hs.kr', '박하람', '27dee860950265977d4bff21695f389c6fc4e834dd5f5cc76e6a3dcecce4e120', 0);
INSERT INTO user(id, email, name, password, point) VALUES (15, 'sspzoa@dimigo.hs.kr', '서승표', '27dee860950265977d4bff21695f389c6fc4e834dd5f5cc76e6a3dcecce4e120', 0);   
INSERT INTO user(id, email, name, password, point) VALUES (16, 'pianoman@dimigo.hs.kr', '송솔우', '27dee860950265977d4bff21695f389c6fc4e834dd5f5cc76e6a3dcecce4e120', 0); 
INSERT INTO user(id, email, name, password, point) VALUES (17, 'djadbsth@dimigo.hs.kr', '엄윤서', '27dee860950265977d4bff21695f389c6fc4e834dd5f5cc76e6a3dcecce4e120', 0); 
INSERT INTO user(id, email, name, password, point) VALUES (18, 'totoro@dimigo.hs.kr', '윤수아', '27dee860950265977d4bff21695f389c6fc4e834dd5f5cc76e6a3dcecce4e120', 0);   
INSERT INTO user(id, email, name, password, point) VALUES (19, 'mathgiveuper1@dimigo.hs.kr', '윤재영', '27dee860950265977d4bff21695f389c6fc4e834dd5f5cc76e6a3dcecce4e120', 0);
INSERT INTO user(id, email, name, password, point) VALUES (20, 'ganghyeok7@dimigo.hs.kr', '이진혁', '27dee860950265977d4bff21695f389c6fc4e834dd5f5cc76e6a3dcecce4e120', 0);
INSERT INTO user(id, email, name, password, point) VALUES (21, 'ish22@dimigo.hs.kr', '임수현', '27dee860950265977d4bff21695f389c6fc4e834dd5f5cc76e6a3dcecce4e120', 0);    
INSERT INTO user(id, email, name, password, point) VALUES (22, 'bonobono07@dimigo.hs.kr', '임화랑', '27dee860950265977d4bff21695f389c6fc4e834dd5f5cc76e6a3dcecce4e120', 0);
INSERT INTO user(id, email, name, password, point) VALUES (23, 'dearmoon07@dimigo.hs.kr', '장기범', '27dee860950265977d4bff21695f389c6fc4e834dd5f5cc76e6a3dcecce4e120', 0);
INSERT INTO user(id, email, name, password, point) VALUES (24, 'ok.jyjang@dimigo.hs.kr', '장준영', '27dee860950265977d4bff21695f389c6fc4e834dd5f5cc76e6a3dcecce4e120', 0);
INSERT INTO user(id, email, name, password, point) VALUES (25, 'yina0514@dimigo.hs.kr', '정이나', '27dee860950265977d4bff21695f389c6fc4e834dd5f5cc76e6a3dcecce4e120', 0); 
INSERT INTO user(id, email, name, password, point) VALUES (26, 'diatcps4613@dimigo.hs.kr', '정하승', '27dee860950265977d4bff21695f389c6fc4e834dd5f5cc76e6a3dcecce4e120', 0);
INSERT INTO user(id, email, name, password, point) VALUES (27, 'wbrother07@dimigo.hs.kr', '조우형', '27dee860950265977d4bff21695f389c6fc4e834dd5f5cc76e6a3dcecce4e120', 0);
INSERT INTO user(id, email, name, password, point) VALUES (28, 'goodrain9540@dimigo.hs.kr', '조은비', '27dee860950265977d4bff21695f389c6fc4e834dd5f5cc76e6a3dcecce4e120', 0);
INSERT INTO user(id, email, name, password, point) VALUES (29, 'joohangyeol@dimigo.hs.kr', '주한결', '27dee860950265977d4bff21695f389c6fc4e834dd5f5cc76e6a3dcecce4e120', 0);
INSERT INTO user(id, email, name, password, point) VALUES (30, 'castorpolluxal1@dimigo.hs.kr', '최지윤', '27dee860950265977d4bff21695f389c6fc4e834dd5f5cc76e6a3dcecce4e120', 0);
INSERT INTO user(id, email, name, password, point) VALUES (31, 'veritas1yc@dimigo.hs.kr', '황유찬', '27dee860950265977d4bff21695f389c6fc4e834dd5f5cc76e6a3dcecce4e120', 0);
INSERT INTO user(id, email, name, password, point) VALUES (32, 'hdcuteboy@dimigo.hs.kr', '황윤성', '27dee860950265977d4bff21695f389c6fc4e834dd5f5cc76e6a3dcecce4e120', 0);
*/