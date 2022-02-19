import { useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import { useMutation, useQuery } from 'react-query';

import useCurrentUser from 'hooks/useCurrentUser';
import { ScheduleBlockDto } from 'apis/dtos';
import * as apis from 'apis';

import * as timetableState from 'states/timetableState';

import Timetable from 'components/timetable/Timetable';
import ScreenSpinner from 'components/common/ScreenSpinner';
import { useRecoilState } from 'recoil';

type TimetableContainerProps = {
  timetableId: string;
};

const TimetableContainer = ({ timetableId }: TimetableContainerProps) => {
  const { isLoading, id: currentUserId } = useCurrentUser();

  const [selectedSubmitterId] = useRecoilState(timetableState.selectedSubmitterId);

  const { data: timetable, refetch } = useQuery<ScheduleBlockDto.ScheduleBlock[] | null, Error>(
    'getSchedulblocks',
    () => apis.scheduleBlock.getScheduleBlocksByTimetableId(timetableId as string),
    {
      refetchInterval: 3000,
    }
  );

  const createMutation = useMutation(
    async ({
      startTime,
      // endTime,
      day,
    }: {
      startTime: number;
      startMinute: number;
      endTime: number;
      endMinute: number;
      day: number;
    }): Promise<void> => {
      await apis.scheduleBlock.createScheduleBlock({
        tableId: timetableId,
        startTime,
        startMinute: 0,
        endTime: startTime,
        endMinute: 58,
        day,
      });
    },
    {
      onSuccess: () => {
        refetch();
      },
    }
  );

  const deleteMutation = useMutation(
    async ({ id }: ScheduleBlockDto.DeleteRequest): Promise<void> => {
      await apis.scheduleBlock.deleteScheduleBlock({
        id,
      });
    },
    {
      onSuccess: () => {
        refetch();
      },
    }
  );

  const handleClick = useCallback(
    (cell, scheduleBlock?: ScheduleBlockDto.ScheduleBlock) => {
      if (!scheduleBlock) {
        createMutation.mutate(cell);
        return;
      }

      if (scheduleBlock && scheduleBlock.userId === currentUserId) {
        deleteMutation.mutate({ id: scheduleBlock.id });
        return;
      }

      createMutation.mutate(cell);
    },
    [createMutation, deleteMutation, currentUserId]
  );

  if (isLoading) return <ScreenSpinner />;
  if (!currentUserId) return <Navigate to="/" />;

  // TODO: timetable 네이밍을 scheduleBlocks 로 변경
  return (
    <Timetable
      scheduleBlocks={timetable || []}
      selectedSubmitterId={selectedSubmitterId}
      currentUserId={currentUserId}
      onClick={handleClick}
    />
  );
};

export default TimetableContainer;
