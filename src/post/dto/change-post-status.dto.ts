import { IsNotEmpty, IsIn } from 'class-validator';
import { POST_STATUS } from 'src/enums';

export class ChangePostStatus {
  @IsNotEmpty()
  @IsIn([POST_STATUS.ACTIVE, POST_STATUS.CANCELLED, POST_STATUS.COMPLETE])
  postStatus: POST_STATUS;
}
