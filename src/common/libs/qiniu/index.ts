import { InternalServerErrorException } from '@nestjs/common';
import * as crypto from 'crypto';
import * as qiniu from 'qiniu';
import * as url from 'url';

import { config } from '@/config';
import { FileType } from '@/common/interface';

export interface FileInfo {
  originalname: string;
  buffer: Buffer;
}

export async function uploadFile(
  file: FileInfo,
  type: FileType,
  pathPrefix: string = '',
) {
  // get token
  const mac = new qiniu.auth.digest.Mac(
    config.get('qiniu.ak'),
    config.get('qiniu.sk'),
  );
  const putPolicy = new qiniu.rs.PutPolicy({
    scope: config.get('qiniu.scope'),
  });
  const uploadToken = putPolicy.uploadToken(mac);

  // uoload
  const formUploader = new qiniu.form_up.FormUploader(
    new qiniu.conf.Config({
      zone: qiniu.zone.Zone_z0,
    }),
  );

  const randomName = Array(32)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  const fileName = crypto
    .createHash('md5')
    .update(`${randomName}-${Date.now()}-${file.originalname}`)
    .digest('hex');

  const res = await formUploader.put(
    uploadToken,
    `${pathPrefix}${type}/${fileName}`,
    file.buffer,
    new qiniu.form_up.PutExtra(),
    () => {},
  );
  if (res.resp.statusCode !== 200) {
    throw res.resp;
  }
  return new url.URL(res.data.key, config.get('qiniu.host')).href;
}
