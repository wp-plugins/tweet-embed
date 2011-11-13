<?php
/**
 * @package Tweet-Embed
 * @version 0.1
 */
/*
Plugin Name: Tweet Embed
Plugin URI: http://wordpress.org/extend/plugins/tweet-embed/
Description: Embed tweets in blog posts just as you would YouTube videos or Flickr photos
Author: Flaming Tarball
Version: 0.1
Author URI: http://flamingtarball.com/
*/

function tweet_embed_random_id() {
	$password = '';
	$possible = '2346789bcdfghjkmnpqrtvwxyzBCDFGHJKLMNPQRTVWXYZ';
	$maxlength = strlen($possible);
	
	$i = 0; 
	while ($i < 8) { 
		$char = substr($possible, mt_rand(0, $maxlength-1), 1);
		if (!strstr($password, $char)) { 
			$password .= $char;
			$i ++;
		}
	}
	
	return $password;
}

function tweet_embed_the_content($content) {
	$ex = "/\<p\>(https?\:\/\/twitter\.com\/(#!\/)?\w+\/status(?:es)?\/(\d+)\/?)<\/p\>/i";
	$offset = 0;
	$divs = array();
	$post_id = get_the_ID();
	
	while(preg_match($ex, $content, $match, $offset)) {
		if($match) {
			$tweet_url = $match[1];
			$tweet_id = $match[3];
			$div = "<div class=\"tweet-embed-tweet\" data-id=\"${tweet_id}\" id=\"" . tweet_embed_random_id() . "\"><noscript><p><a href=\"${tweet_url}\">View this tweet at twitter.com</a></p></noscript></div>";
			$content = str_replace("<p>$tweet_url</p>", $div, $content);
			$divs[] = $div;
		} else {
			return $content;
		}
	}
	
	if(count($divs) > 0) {
		
	}
	
	return $content;
}

function tweet_embed_init() {
	wp_register_script('tweet-embed',
		plugins_url('tweet-embed/tweet-embed.js', 'tweet-embed'),
		array('jquery'), '0.1', false
	);
}

function tweet_embed_enqueue_scripts() {
	wp_enqueue_script('tweet-embed');
}

if (!is_admin()) {
	add_filter('the_content', 'tweet_embed_the_content');
	add_action('wp_enqueue_scripts', 'tweet_embed_enqueue_scripts');
}

add_action('init', 'tweet_embed_init');