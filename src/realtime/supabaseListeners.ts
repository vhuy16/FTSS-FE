import { supabase } from 'lib/supabaseClient'; // file này chứa instance đã khởi tạo Supabase client
import { AppDispatch } from '@redux/store';
import { getAllRoom, getAllRooms, getRoomDetail } from '@redux/slices/chatSlice';

export const subscribeToRoomMessages = (roomId: string, dispatch: AppDispatch) => {
    // Tạo channel với tên rõ ràng để debug
    const channel = supabase
        .channel(`room-messages-${roomId}`) // tên channel có thể tuỳ chỉnh
        .on(
            'postgres_changes',
            {
                event: '*', // lắng nghe tất cả: INSERT, UPDATE, DELETE
                schema: 'public',
                table: 'messages',
                // filter: `room_id=eq.${roomId}`, // chỉ lắng nghe tin nhắn thuộc roomId này
            },
            async (payload) => {
                // Gọi lại API để lấy toàn bộ message mới (hoặc bạn có thể xử lý payload trực tiếp để tối ưu)
                await dispatch(getRoomDetail(roomId));
                await dispatch(getAllRoom());
            },
        )
        .subscribe((status) => {
            console.log('🟢 Đã kết nối Supabase channel:', status);
        });

    return channel; // để unsubscribe khi component unmount
};
export const subscribeToRoomChanges = (dispatch: AppDispatch) => {
    const channel = supabase
        .channel('room-listener')
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'room',
            },
            (payload) => {
                dispatch(getAllRoom());
            },
        )
        .subscribe((status) => {
            console.log('🟢 Đã kết nối room channel:', status);
        });

    return channel;
};
