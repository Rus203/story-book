import { IsIn, IsMongoId, IsNotEmpty } from 'class-validator';
import { REQUEST_STATUS } from 'src/enums';

export class TakeDecisionDto {
  @IsNotEmpty()
  @IsIn([REQUEST_STATUS.APPROVE, REQUEST_STATUS.REJECTED])
  decision: REQUEST_STATUS;

  @IsMongoId()
  postId: string;
}
