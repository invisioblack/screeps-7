/**
 * TODO: implement max property
 * mode 1: spawn by ratios
 * mode 2: direct parts spawn
 * mode 3: spawn based on RSL
  */

"use strict";
module.exports =
	{
		"worker": {
			"mode": 3 ,
			"parts": [
				//0
				[
					WORK ,
					CARRY ,
					MOVE
				] ,
				//1
				[
					WORK ,
					CARRY ,
					MOVE
				] ,
				//2
				[
					WORK ,
					WORK ,
					CARRY ,
					CARRY ,
					CARRY ,
					MOVE ,
					MOVE ,
					MOVE ,
				] ,
				//3
				[
					WORK ,
					WORK ,
					WORK ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE
				] ,
				//4
				[
					WORK ,
					WORK ,
					WORK ,
					WORK ,
					WORK ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE
				] ,
				//5
				[
					WORK ,
					WORK ,
					WORK ,
					WORK ,
					WORK ,
					WORK ,
					WORK ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE
				] ,
				//6
				[
					WORK ,
					WORK ,
					WORK ,
					WORK ,
					WORK ,
					WORK ,
					WORK ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE
				] ,
				//7
				[
					WORK ,
					WORK ,
					WORK ,
					WORK ,
					WORK ,
					WORK ,
					WORK ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE
				] ,
				//8
				[
					WORK ,
					WORK ,
					WORK ,
					WORK ,
					WORK ,
					WORK ,
					WORK ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE
				]
			] ,
			"memory": {
				"unit": "worker"
			}
		} ,

		"harvester": {
			"mode": 3 ,
			"parts": [
				//0
				[
					WORK ,
					WORK ,
					WORK ,
					WORK ,
					WORK ,
					MOVE
				] ,
				//1
				[
					WORK ,
					WORK ,
					WORK ,
					WORK ,
					WORK ,
					MOVE
				] ,
				//2
				[
					WORK ,
					WORK ,
					WORK ,
					WORK ,
					WORK ,
					MOVE
				] ,
				//3
				[
					WORK ,
					WORK ,
					WORK ,
					WORK ,
					WORK ,
					MOVE
				] ,
				//4
				[
					WORK ,
					WORK ,
					WORK ,
					WORK ,
					WORK ,
					MOVE
				] ,
				//5
				[
					WORK ,
					WORK ,
					WORK ,
					WORK ,
					WORK ,
					WORK ,
					CARRY ,
					MOVE
				] ,
				//6
				[
					WORK ,
					WORK ,
					WORK ,
					WORK ,
					WORK ,
					WORK ,
					CARRY ,
					MOVE
				] ,
				//7
				[
					WORK ,
					WORK ,
					WORK ,
					WORK ,
					WORK ,
					WORK ,
					CARRY ,
					MOVE
				] ,
				//8
				[
					WORK ,
					WORK ,
					WORK ,
					WORK ,
					WORK ,
					WORK ,
					CARRY ,
					MOVE
				] ,
			] ,
			"memory": {
				"unit": "harvester"
			}
		} ,

		"ldharvester": {
			"mode": 2 ,
			"parts": [
				WORK ,
				WORK ,
				WORK ,
				WORK ,
				WORK ,
				CARRY ,
				MOVE ,
				MOVE
			] ,
			"memory": {
				"unit": "ldharvester"
			}
		} ,

		"hauler": {
			"mode": 3 ,
			"parts": [
				// 0
				[
					CARRY ,
					CARRY ,
					CARRY ,
					MOVE ,
					MOVE
				] ,
				// 1
				[
					CARRY ,
					CARRY ,
					CARRY ,
					MOVE ,
					MOVE
				] ,
				// 2
				[
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE
				] ,
				// 3
				[
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE
				] ,
				// 4
				[
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE
				] ,
				// 5
				[
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE
				] ,
				// 6
				[
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE
				] ,
				// 7
				[
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE
				] ,
				// 8
				[
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					CARRY ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE
				]
			] ,
			"memory": {
				"unit": "hauler"
			}
		} ,

		"claimer": {
			"mode": 3 ,
			"parts": [
				// 0
				[
					CLAIM ,
					CLAIM ,
					MOVE ,
					MOVE
				] ,
				// 1
				[
					CLAIM ,
					CLAIM ,
					MOVE ,
					MOVE
				] ,
				// 2
				[
					CLAIM ,
					CLAIM ,
					MOVE ,
					MOVE
				] ,
				// 3
				[
					CLAIM ,
					CLAIM ,
					MOVE ,
					MOVE
				] ,
				// 4
				[
					CLAIM ,
					CLAIM ,
					MOVE ,
					MOVE
				] ,
				// 5
				[
					CLAIM ,
					CLAIM ,
					MOVE ,
					MOVE
				] ,
				// 6
				[
					CLAIM ,
					CLAIM ,
					CLAIM ,
					MOVE ,
					MOVE ,
					MOVE
				] ,
				// 7
				[
					CLAIM ,
					CLAIM ,
					CLAIM ,
					MOVE ,
					MOVE ,
					MOVE
				] ,
				// 8
				[
					CLAIM ,
					CLAIM ,
					CLAIM ,
					MOVE ,
					MOVE ,
					MOVE
				]
			] ,
			"memory": {
				"unit": "claimer"
			}
		} ,

		"guard": {
			"mode": 3 ,
			"parts": [
				[ // 0
					TOUGH ,
					ATTACK ,
					MOVE
				] ,
				[ // 1
					ATTACK ,
					ATTACK ,
					MOVE ,
					MOVE
				] ,
				[ // 2
					TOUGH ,
					TOUGH ,
					ATTACK ,
					ATTACK ,
					ATTACK ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE
				] ,
				[ // 3
					TOUGH ,
					TOUGH ,
					ATTACK ,
					ATTACK ,
					ATTACK ,
					ATTACK ,
					ATTACK ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE
				] ,
				[ // 4
					TOUGH ,
					TOUGH ,
					ATTACK ,
					ATTACK ,
					ATTACK ,
					ATTACK ,
					ATTACK ,
					ATTACK ,
					ATTACK ,
					ATTACK ,
					ATTACK ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE
				] ,
				[ // 5
					TOUGH ,
					TOUGH ,
					TOUGH ,
					ATTACK ,
					ATTACK ,
					ATTACK ,
					ATTACK ,
					ATTACK ,
					ATTACK ,
					ATTACK ,
					ATTACK ,
					ATTACK ,
					ATTACK ,
					ATTACK ,
					ATTACK ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE
				] ,
				[ // 6
					TOUGH ,
					TOUGH ,
					TOUGH ,
					ATTACK ,
					ATTACK ,
					ATTACK ,
					ATTACK ,
					ATTACK ,
					ATTACK ,
					ATTACK ,
					ATTACK ,
					ATTACK ,
					ATTACK ,
					ATTACK ,
					ATTACK ,
					ATTACK ,
					ATTACK ,
					ATTACK ,
					ATTACK ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE
				] ,
				[ // 7
					TOUGH ,
					TOUGH ,
					TOUGH ,
					ATTACK ,
					ATTACK ,
					ATTACK ,
					ATTACK ,
					ATTACK ,
					ATTACK ,
					ATTACK ,
					ATTACK ,
					ATTACK ,
					ATTACK ,
					ATTACK ,
					ATTACK ,
					ATTACK ,
					ATTACK ,
					ATTACK ,
					ATTACK ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE
				] ,
				[ // 8
					TOUGH ,
					TOUGH ,
					TOUGH ,
					ATTACK ,
					ATTACK ,
					ATTACK ,
					ATTACK ,
					ATTACK ,
					ATTACK ,
					ATTACK ,
					ATTACK ,
					ATTACK ,
					ATTACK ,
					ATTACK ,
					ATTACK ,
					ATTACK ,
					ATTACK ,
					ATTACK ,
					ATTACK ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE ,
					MOVE
				]
			] ,
			"memory": {
				"unit": "guard"
			}
		} ,

		"rangedGuard": {
			"mode": 1 ,
			"parts": [
				{
					"part": TOUGH ,
					"weight": 0.1 ,
					"minimum": 0
				} ,
				{
					"part": ATTACK ,
					"weight": 0.6 ,
					"minimum": 1
				} ,
				{
					"part": MOVE ,
					"weight": 0.3 ,
					"minimum": 1
				}
			] ,
			"memory": {
				"unit": "rangedGuard"
			}
		} ,

		"heal": {
			"mode": 1 ,
			"parts": [
				{
					"part": TOUGH ,
					"weight": 0.1 ,
					"minimum": 0
				} ,
				{
					"part": HEAL ,
					"weight": 0.6 ,
					"minimum": 1
				} ,
				{
					"part": MOVE ,
					"weight": 0.3 ,
					"minimum": 1
				}
			] ,
			"memory": {
				"unit": "heal"
			}
		},

		"scout": {
			"mode": 2 ,
			"parts": [ MOVE ] ,
			"memory": {
				"unit": "scout"
			}
		}
	};