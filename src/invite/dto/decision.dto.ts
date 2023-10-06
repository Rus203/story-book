import { IsIn, IsNotEmpty } from 'class-validator';
import { INVITE_STATUS } from 'src/enums';

export class DecisionDto {
  @IsNotEmpty()
  @IsIn([INVITE_STATUS.APPROVE, INVITE_STATUS.REJECTED])
  decision: INVITE_STATUS;
}
