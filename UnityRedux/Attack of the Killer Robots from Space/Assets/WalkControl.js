#pragma strict

public var MovementImpulse : float;
public var FootLiftImpulse : float;
public var StepInterval : float;
public var Foot : FootResponder;

private var RemainingTimeUntilNextStepIsAllowed : float;

function Start () 
{
	RemainingTimeUntilNextStepIsAllowed = 0;
}

function Update () 
{
	transform.position = Foot.rigidbody.position;
	//rigidbody.AddRelativeForce(Input.GetAxis("Horizontal") * MovementForce, 0, Input.GetAxis("Vertical") * MovementForce);
	RemainingTimeUntilNextStepIsAllowed -= Time.deltaTime;
	if(RemainingTimeUntilNextStepIsAllowed < 0 && Foot.IsOnWalkableSurface)
	{
		var forwardImpulse = Input.GetAxis("Vertical") * MovementImpulse;
		var rightwardImpulse = Input.GetAxis("Horizontal") * MovementImpulse;
		if(rightwardImpulse != 0 || forwardImpulse != 0)
		{
			var impulse = transform.rotation * Vector3(rightwardImpulse, FootLiftImpulse, forwardImpulse);
			Foot.rigidbody.AddForce(impulse, ForceMode.Impulse);
			RemainingTimeUntilNextStepIsAllowed = StepInterval;
		}
	}
}