import { useState, useEffect } from 'react';
import { intervalToDuration } from 'date-fns';
import { Bell, Check, ChevronDown,  ChevronUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { io, Socket } from 'socket.io-client';
import { updateNotification } from '@/lib/api';
import { useStore } from "@/store/app.store"

type NotificationType = {
  _id: number;
  title: string;
  description: string;
  isRead: boolean;
  createdAt: Date;
  routeRedirect: string;
};

export const Notifications = () => {
    const [showBell, setShowBell] = useState(false);
    const [notifications, setNotifications] = useState<NotificationType[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [expandedNotifications, setExpandedNotifications] = useState<number[]>([]);
    const { getToken, getUserInfo } = useStore()
    const [socket, setSocket] = useState<Socket | null>(null);
    const token = getToken();
    useEffect(() => {
        if (notifications) {
            setUnreadCount(notifications.filter(n => !n.isRead).length);
        }
    }, [notifications]);

    useEffect(() => {
           const newSocket = io(`${import.meta.env.VITE_API_URL}`, {
            auth: { token },
            withCredentials: true,
          })
          setSocket(newSocket)
          console.log(newSocket)
          return () => {
            newSocket.disconnect()
          }
    }, []);

    useEffect(() => {
        if (socket) {
          socket.on(`notification-${getUserInfo()._id}`, handleNotification)
        }
      }, [socket])

    const handleNotification = (data: any) => {
        const newData = JSON.parse(data)
        console.log(newData)
        setNotifications(prevNotifications => [newData, ...prevNotifications]);
    };

    const markAsRead = async (_id: number) => {
        try {
            const notification = notifications.find(notif => notif._id === _id) as NotificationType;
            console.log(notification._id)
            const { status } = await updateNotification(notification._id.toString(), { isRead: true }) as unknown as any;
            if (status === 200) {
                setNotifications(prevNotifications =>
                    prevNotifications
                        .map(notif => notif._id === _id ? { ...notif, isRead: true } : notif)
                        .sort((a, b) => {
                            if (a.isRead === b.isRead) {
                                return b.createdAt > a.createdAt ? 1 : -1;
                            }
                            return a.isRead ? 1 : -1;
                        })
                );
                setUnreadCount(prev => prev - 1);
            }
        } catch (error) {
            console.log(error);
        }
    };

    // const markAllAsRead = async () => {
    //     try {
    //         // const { status } = await updateAllAgentNotificationStatus({ status: true });
    //         // if (status === 200) {
    //         //     setNotifications(notifications.map(notif => ({ ...notif, isRead: true })));
    //         //     setUnreadCount(0);
    //         // }
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };

    const toggleDescription = (id: number) => {
        setExpandedNotifications(prev =>
            prev.includes(id) ? prev.filter(nId => nId !== id) : [...prev, id]
        );
    };

    const formatTimeAgo = (date: Date) => {
        const duration = intervalToDuration({ start: date, end: new Date() });
        if (duration.days) return `${duration.days}d ago`;
        if (duration.hours) return `${duration.hours}h ago`;
        if (duration.minutes) return `${duration.minutes}m ago`;
        return 'Just now';
    };

    return (
        <div className="relative">
            <Button variant="ghost" className='w-4 h-4 mt-[-1rem] hover:bg-inherit' size="icon" onClick={() => setShowBell(!showBell)}>
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                    <Badge variant="destructive" className="absolute flex items-center justify-center w-4 h-4 p-0 -top-1 -right-1">
                        {unreadCount}
                    </Badge>
                )}
            </Button>
            {showBell && (
                <Card className="absolute z-50 mt-2 shadow-lg md:right-0 top-full w-80">
                    <CardHeader className="flex flex-row items-center justify-between px-4 py-2">
                        <CardTitle className="text-base font-semibold">Notifications</CardTitle>
                        {/* {unreadCount > 0 && (
                            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="h-8 text-xs">
                                <CheckCheck className="w-3 h-3 mr-1" />
                                Mark all as read
                            </Button>
                        )} */}
                    </CardHeader>
                    <CardContent className="p-0">
                        <ScrollArea className="h-[300px]">
                            <div>
                                {notifications.map((notification) => (
                                    <div
                                        key={notification._id}
                                        className={`flex flex-col p-4 ${
                                            notification.isRead ? 'bg-background' : 'bg-accent'
                                        } hover:bg-accent transition-colors`}
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <p className="text-sm font-medium">{notification.title}</p>
                                            <p className="text-xs text-muted-foreground">{formatTimeAgo(notification.createdAt)}</p>
                                        </div>
                                        <div className="mb-2">
                                            {notification.description.length <= 100 ? (
                                                <p className="text-sm text-muted-foreground">{notification.description}</p>
                                            ) : (
                                                <>
                                                    <p className="text-sm text-muted-foreground">
                                                        {expandedNotifications.includes(notification._id)
                                                            ? notification.description
                                                            : `${notification.description.slice(0, 100)}...`}
                                                    </p>
                                                    <Button
                                                        variant="link"
                                                        size="sm"
                                                        onClick={() => toggleDescription(notification._id)}
                                                        className="h-auto p-0 text-xs text-primary"
                                                    >
                                                        {expandedNotifications.includes(notification._id) ? (
                                                            <>
                                                                View less
                                                                <ChevronUp className="w-3 h-3 ml-1" />
                                                            </>
                                                        ) : (
                                                            <>
                                                                View all
                                                                <ChevronDown className="w-3 h-3 ml-1" />
                                                            </>
                                                        )}
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between">
                                            {!notification.isRead && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => markAsRead(notification._id)}
                                                    className="h-8 text-xs"
                                                >
                                                    <Check className="w-3 h-3 mr-1" />
                                                    Mark as read
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                    <CardFooter className="p-4">
                    </CardFooter>
                </Card>
            )}
        </div>
    );
};

