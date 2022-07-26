export interface Post {
  current_status: string;
  enqueue_time: string;
  event: Event;
  flagged: boolean;
  followed_by_user: boolean;
  full_command: string;
  guild_id: any;
  hidden: boolean;
  id: string;
  image_paths: string[];
  is_published: boolean;
  like_count: number;
  liked_by_user: boolean;
  liked_timestamp: any;
  mod_hidden: boolean;
  platform: string;
  platform_channel: string;
  platform_channel_id: string;
  platform_message_id: string;
  platform_thread_id: any;
  prompt: string;
  ranked_by_user: boolean;
  ranked_timestamp: any;
  ranking_by_user: any;
  reference_image_num: any;
  reference_job_id: any;
  type: string;
  user_id: string;
  user_ranking_count: number;
  user_ranking_score: number;
  username: string;
}

export interface Event {
  height: number;
  textPrompt: string[];
  imagePrompts: any;
  width: number;
  batchSize: number;
  seedImageURL: any;
}
