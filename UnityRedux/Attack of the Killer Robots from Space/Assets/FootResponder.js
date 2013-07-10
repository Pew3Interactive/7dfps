#pragma strict

public var IsOnWalkableSurface : boolean;

function OnCollisionEnter(collision : Collision)
{
	IsOnWalkableSurface = true;
}

function OnCollisionExit(collision : Collision)
{
	IsOnWalkableSurface = false;
}
